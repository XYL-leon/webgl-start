<script setup>
// 圆角矩形

import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

function drawContourRegions(points, thresholds, colors, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // 创建网格数据
  const gridSize = 5;
  const gridWidth = Math.ceil(width / gridSize);
  const gridHeight = Math.ceil(height / gridSize);
  const grid = new Array(gridWidth * gridHeight);

  // 初始化网格值（使用反距离权重插值）
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const gridX = x * gridSize;
      const gridY = y * gridSize;

      let totalValue = 0;
      let totalWeight = 0;

      points.forEach((point) => {
        const dx = gridX - point.x;
        const dy = gridY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1) {
          totalValue = point.value;
          totalWeight = 1;
          return;
        }

        const weight = 1 / (distance * distance);
        totalValue += point.value * weight;
        totalWeight += weight;
      });

      grid[y * gridWidth + x] = totalWeight > 0 ? totalValue / totalWeight : 0;
    }
  }

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 为每个阈值绘制区域
  thresholds.forEach((threshold, index) => {
    const color = colors[index];
    const nextThreshold =
      index < thresholds.length - 1 ? thresholds[index + 1] : Infinity;

    // 绘制当前阈值和下一个阈值之间的区域
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // 使用扫描线填充算法
    for (let y = 0; y < gridHeight - 1; y++) {
      for (let x = 0; x < gridWidth - 1; x++) {
        const i = y * gridWidth + x;
        const v0 = grid[i];
        const v1 = grid[i + 1];
        const v2 = grid[i + gridWidth + 1];
        const v3 = grid[i + gridWidth];

        // 检查当前网格是否在阈值范围内
        const minVal = Math.min(v0, v1, v2, v3);
        const maxVal = Math.max(v0, v1, v2, v3);

        if (minVal >= threshold && maxVal < nextThreshold) {
          // 整个网格都在范围内，直接填充
          ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        } else if (
          (minVal < threshold && maxVal >= threshold) ||
          (minVal < nextThreshold && maxVal >= nextThreshold)
        ) {
          // 部分在范围内，需要更精确的填充
          const contour = getGridContour(
            x,
            y,
            grid,
            gridWidth,
            gridSize,
            threshold
          );
          if (contour) {
            ctx.beginPath();
            ctx.moveTo(contour[0][0], contour[0][1]);
            for (let i = 1; i < contour.length; i++) {
              ctx.lineTo(contour[i][0], contour[i][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    }
  });

  // 绘制原始数据点
  points.forEach((point) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 获取单个网格的等值线
function getGridContour(x, y, grid, gridWidth, gridSize, threshold) {
  const i = y * gridWidth + x;
  const v0 = grid[i];
  const v1 = grid[i + 1];
  const v2 = grid[i + gridWidth + 1];
  const v3 = grid[i + gridWidth];

  const x0 = x * gridSize;
  const y0 = y * gridSize;
  const x1 = (x + 1) * gridSize;
  const y1 = (y + 1) * gridSize;

  // 线性插值函数
  const interp = (v1, v2, p1, p2) => {
    const t = (threshold - v1) / (v2 - v1);
    return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
  };

  // 计算状态
  let state = 0;
  if (v0 >= threshold) state |= 1;
  if (v1 >= threshold) state |= 2;
  if (v2 >= threshold) state |= 4;
  if (v3 >= threshold) state |= 8;

  // 根据状态生成等值线
  switch (state) {
    case 0:
      return null;
    case 1:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v0, v3, [x0, y0], [x0, y1]),
      ];
    case 2:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v1, v2, [x1, y0], [x1, y1]),
      ];
    case 3:
      return [
        interp(v0, v3, [x0, y0], [x0, y1]),
        interp(v1, v2, [x1, y0], [x1, y1]),
      ];
    case 4:
      return [
        interp(v1, v2, [x1, y0], [x1, y1]),
        interp(v3, v2, [x0, y1], [x1, y1]),
      ];
    case 5:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v1, v2, [x1, y0], [x1, y1]),
        interp(v3, v2, [x0, y1], [x1, y1]),
        interp(v0, v3, [x0, y0], [x0, y1]),
      ];
    case 6:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v3, v2, [x0, y1], [x1, y1]),
      ];
    case 7:
      return [
        interp(v0, v3, [x0, y0], [x0, y1]),
        interp(v3, v2, [x0, y1], [x1, y1]),
      ];
    case 8:
      return [
        interp(v3, v2, [x0, y1], [x1, y1]),
        interp(v0, v3, [x0, y0], [x0, y1]),
      ];
    case 9:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v3, v2, [x0, y1], [x1, y1]),
      ];
    case 10:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v0, v3, [x0, y0], [x0, y1]),
        interp(v3, v2, [x0, y1], [x1, y1]),
        interp(v1, v2, [x1, y0], [x1, y1]),
      ];
    case 11:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v1, v2, [x1, y0], [x1, y1]),
      ];
    case 12:
      return [
        interp(v0, v3, [x0, y0], [x0, y1]),
        interp(v1, v2, [x1, y0], [x1, y1]),
      ];
    case 13:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v0, v3, [x0, y0], [x0, y1]),
      ];
    case 14:
      return [
        interp(v0, v1, [x0, y0], [x1, y0]),
        interp(v1, v2, [x1, y0], [x1, y1]),
      ];
    case 15:
      return null;
    default:
      return null;
  }
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
    drawContourRegions(points, thresholds, colors, "tutorial");
    // drawContourRegions(points, thresholds, colors, "myCanvas");
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