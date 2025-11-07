<script setup>
// 圆角矩形

import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

function drawKrigingContour(points, thresholds, colors, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // 创建网格数据
  const gridSize = 5;
  const gridWidth = Math.ceil(width / gridSize);
  const gridHeight = Math.ceil(height / gridSize);
  const grid = new Array(gridWidth * gridHeight);

  // 克里金插值参数
  const nugget = 0.1; // 块金效应
  const sill = 1.0; // 基台值
  const range = 100; // 变程

  // 计算协方差矩阵
  const n = points.length;
  const covarianceMatrix = new Array(n * n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 指数协方差函数
      const covariance = sill * Math.exp((-3 * distance) / range);
      covarianceMatrix[i * n + j] = i === j ? covariance + nugget : covariance;
    }
  }

  // 对每个网格点进行克里金插值
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const gridX = x * gridSize;
      const gridY = y * gridSize;

      // 计算待插值点与各已知点的协方差
      const b = new Array(n);
      for (let i = 0; i < n; i++) {
        const dx = gridX - points[i].x;
        const dy = gridY - points[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        b[i] = sill * Math.exp((-3 * distance) / range);
      }

      // 解线性方程组求权重
      const weights = solveLinearSystem(covarianceMatrix, b, n);

      // 计算插值结果
      let interpolatedValue = 0;
      for (let i = 0; i < n; i++) {
        interpolatedValue += weights[i] * points[i].value;
      }

      grid[y * gridWidth + x] = interpolatedValue;
    }
  }

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 创建离屏Canvas用于渲染颜色
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const colorCtx = colorCanvas.getContext("2d");
  const colorImageData = colorCtx.createImageData(width, height);
  const colorData = colorImageData.data;

  // 为每个像素确定颜色
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gridX = Math.floor(x / gridSize);
      const gridY = Math.floor(y / gridSize);

      if (gridX < 0 || gridX >= gridWidth || gridY < 0 || gridY >= gridHeight) {
        continue;
      }

      const value = grid[gridY * gridWidth + gridX];
      let colorIndex = 0;

      // 确定该值对应的颜色索引
      for (let i = 0; i < thresholds.length; i++) {
        if (value >= thresholds[i]) {
          colorIndex = i + 1;
        } else {
          break;
        }
      }

      // 确保索引不越界
      colorIndex = Math.min(colorIndex, colors.length - 1);

      // 解析颜色值
      const color = colors[colorIndex];
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);

      // 设置像素颜色
      const index = (y * width + x) * 4;
      colorData[index] = r;
      colorData[index + 1] = g;
      colorData[index + 2] = b;
      colorData[index + 3] = 255;
    }
  }

  // 应用颜色
  colorCtx.putImageData(colorImageData, 0, 0);

  // 将颜色Canvas绘制到主Canvas
  ctx.drawImage(colorCanvas, 0, 0);

  // 绘制等值线（黑色边界）
  thresholds.forEach((threshold) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // 使用Marching Squares算法生成等值线
    const contours = marchingSquares(
      grid,
      gridWidth,
      gridHeight,
      gridSize,
      threshold
    );

    // 绘制等值线
    contours.forEach((contour) => {
      ctx.beginPath();
      ctx.moveTo(contour[0][0], contour[0][1]);

      for (let i = 1; i < contour.length; i++) {
        ctx.lineTo(contour[i][0], contour[i][1]);
      }

      ctx.closePath();
      ctx.stroke();
    });
  });

  // 绘制原始数据点
  points.forEach((point) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 解线性方程组 Ax = b (简化版高斯消元法)
function solveLinearSystem(A, b, n) {
  // 创建增广矩阵 [A|b]
  const augmented = new Array(n);
  for (let i = 0; i < n; i++) {
    augmented[i] = new Array(n + 1);
    for (let j = 0; j < n; j++) {
      augmented[i][j] = A[i * n + j];
    }
    augmented[i][n] = b[i];
  }

  // 前向消元
  for (let i = 0; i < n; i++) {
    // 寻找主元
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = j;
      }
    }

    // 交换行
    if (maxRow !== i) {
      const temp = augmented[i];
      augmented[i] = augmented[maxRow];
      augmented[maxRow] = temp;
    }

    // 消元
    for (let j = i + 1; j < n; j++) {
      const factor = augmented[j][i] / augmented[i][i];
      for (let k = i; k <= n; k++) {
        augmented[j][k] -= factor * augmented[i][k];
      }
    }
  }

  // 回代求解
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= augmented[i][j] * x[j];
    }
    x[i] = sum / augmented[i][i];
  }

  return x;
}

// Marching Squares 算法实现
function marchingSquares(grid, gridWidth, gridHeight, gridSize, threshold) {
  const contours = [];

  for (let y = 0; y < gridHeight - 1; y++) {
    for (let x = 0; x < gridWidth - 1; x++) {
      const i = y * gridWidth + x;

      // 获取四个角点的值
      const v0 = grid[i];
      const v1 = grid[i + 1];
      const v2 = grid[i + gridWidth + 1];
      const v3 = grid[i + gridWidth];

      // 计算状态（0-15）
      let state = 0;
      if (v0 >= threshold) state |= 1;
      if (v1 >= threshold) state |= 2;
      if (v2 >= threshold) state |= 4;
      if (v3 >= threshold) state |= 8;

      // 跳过全在阈值之上或之下的情况
      if (state === 0 || state === 15) continue;

      // 计算交点
      const x0 = x * gridSize;
      const y0 = y * gridSize;
      const x1 = (x + 1) * gridSize;
      const y1 = (y + 1) * gridSize;

      // 线性插值计算交点位置
      const interp = (v1, v2, p1, p2) => {
        const t = (threshold - v1) / (v2 - v1);
        return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
      };

      let points = [];

      // 根据状态计算交点
      if ((state & 1) !== 0) {
        if ((state & 2) !== 0) {
          points.push(interp(v0, v1, [x0, y0], [x1, y0]));
        }
        if ((state & 8) !== 0) {
          points.push(interp(v0, v3, [x0, y0], [x0, y1]));
        }
      }

      if ((state & 2) !== 0) {
        if ((state & 1) !== 0) {
          points.push(interp(v0, v1, [x0, y0], [x1, y0]));
        }
        if ((state & 4) !== 0) {
          points.push(interp(v1, v2, [x1, y0], [x1, y1]));
        }
      }

      if ((state & 4) !== 0) {
        if ((state & 2) !== 0) {
          points.push(interp(v1, v2, [x1, y0], [x1, y1]));
        }
        if ((state & 8) !== 0) {
          points.push(interp(v3, v2, [x0, y1], [x1, y1]));
        }
      }

      if ((state & 8) !== 0) {
        if ((state & 1) !== 0) {
          points.push(interp(v0, v3, [x0, y0], [x0, y1]));
        }
        if ((state & 4) !== 0) {
          points.push(interp(v3, v2, [x0, y1], [x1, y1]));
        }
      }

      // 处理鞍点情况（状态 5 和 10）
      if (state === 5 || state === 10) {
        // 简化处理，实际应用中可能需要更复杂的判断
        if (Math.random() > 0.5) {
          points = [points[0], points[1], points[3], points[2]];
        } else {
          points = [points[0], points[3], points[2], points[1]];
        }
      }

      if (points.length >= 2) {
        contours.push(points);
      }
    }
  }

  return contours;
}

// 使用示例
const points = [
  { x: 100, y: 100, value: 20 },
  { x: 200, y: 150, value: 50 },
  { x: 300, y: 120, value: 80 },
  { x: 150, y: 200, value: 90 },
  // 更多点...
];

const thresholds = [30, 60, 80];
const colors = ["#ffcccc", "#ff9999", "#ff6666", "#ff3333"];

onMounted(() => {
  if (container.value.getContext) {
    // drawContourRegions(points, thresholds, colors, "tutorial");
    // drawContourRegions(points, thresholds, colors, "myCanvas");
    // drawKrigingContour(points, thresholds, colors, "tutorial");
    drawKrigingContour(points, thresholds, colors, "tutorial");
  } else {
    console.log("您的浏览器不支持canvas");
  }
});
</script>
<template>
  <canvas id="tutorial" ref="container" width="500" height="500"> </canvas>
</template>
<style scoped>
#tutorial {
  display: block;
  border: 1px solid black;
  width: 500px;
  height: 500px;
}
</style>