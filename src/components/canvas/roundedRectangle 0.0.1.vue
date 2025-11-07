<script setup>
// 圆角矩形

import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;
function drawRoundedRect(x, y, width, height, radius, arrowSize) {
  ctx.beginPath();

  // 1. 绘制圆角矩形（同之前的逻辑）
  // 左上角起点
  ctx.moveTo(x + radius, y);
  // 顶部直线
  ctx.lineTo(x + width - radius, y);
  // 右上角圆弧
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  // 右侧直线
  ctx.lineTo(x + width, y + height - radius);
  // 右下角圆弧
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);

  // 2. 从矩形底部延伸绘制三角箭头
  // 底部直线先绘制到箭头左侧起点（预留箭头空间）
  ctx.lineTo(x + width / 2 + arrowSize, y + height);
  // 箭头尖端（向下延伸）
  ctx.lineTo(x + width / 2, y + height + arrowSize * 1.2); // 1.2倍高度让箭头更美观
  // 箭头右侧终点（连接回矩形底部）
  ctx.lineTo(x + width / 2 - arrowSize, y + height);

  // 继续绘制矩形底部剩余部分（从箭头右侧到左下角）
  ctx.lineTo(x + radius, y + height);
  // 左下角圆弧
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  // 左侧直线
  ctx.lineTo(x, y + radius);
  // 左上角圆弧
  ctx.arcTo(x, y, x + radius, y, radius);

  // 闭合路径（形成完整图形）
  ctx.closePath();

  // 设置样式并绘制
  ctx.fillStyle = "#4a90e2"; // 填充色（蓝色）
  ctx.fill(); // 填充矩形
  ctx.strokeStyle = "#2c3e50"; // 边框色（深灰）
  ctx.lineWidth = 1; // 边框宽度
  ctx.stroke(); // 描边边框
}
function draw() {
  ctx.imageSmoothingEnabled = true;
  var size = [72, 32];
  var radius = 12;
  var pixelRatio = window.devicePixelRatio || 1;

  ctx.lineWidth = 1;
  ctx.roundRect(50, 50, size[0], size[1], radius);
  ctx.strokeStyle = "#f00";
  ctx.stroke();

  ctx.fillStyle = "rgba(200,0,0,.3)";
  ctx.fill();
}

function drawContinuousGradient(points, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // 创建一个离屏 Canvas 用于绘制距离场
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  const offscreenCtx = offscreenCanvas.getContext("2d");

  // 清空画布
  ctx.clearRect(0, 0, width, height);
  offscreenCtx.clearRect(0, 0, width, height);

  // 生成热力图数据（基于距离和点的值）
  const imageData = offscreenCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 对每个像素计算受所有点的影响
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let totalValue = 0;
      let totalWeight = 0;

      // 计算所有点对当前像素的影响
      points.forEach((point) => {
        const dx = x - point.x;
        const dy = y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 距离越近权重越大，使用指数衰减
        const weight = Math.exp(-distance / point.influenceRadius);

        totalValue += point.value * weight;
        totalWeight += weight;
      });

      // 计算加权平均值
      const value = totalWeight > 0 ? totalValue / totalWeight : 0;

      // 将值映射到颜色（这里使用简单的红蓝色阶）
      const index = (y * width + x) * 4;
      data[index] = Math.min(255, Math.max(0, value * 2.55)); // R
      data[index + 1] = 0; // G
      data[index + 2] = Math.min(255, Math.max(0, 255 - value * 2.55)); // B
      data[index + 3] = 255; // A
    }
  }

  // 应用计算好的热力图
  offscreenCtx.putImageData(imageData, 0, 0);

  // 将离屏 Canvas 的内容绘制到主 Canvas
  ctx.drawImage(offscreenCanvas, 0, 0);

  // 可选：在热力图上绘制原始数据点
  points.forEach((point) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 使用示例
const points = [
  { x: 100, y: 100, value: 20, influenceRadius: 50 },
  { x: 200, y: 150, value: 50, influenceRadius: 70 },
  { x: 300, y: 120, value: 80, influenceRadius: 60 },
  { x: 150, y: 200, value: 90, influenceRadius: 80 },
  // 更多点...
];

onMounted(() => {
  if (container.value.getContext) {
    // 获取渲染上下文和绘制功能;
    ctx = container.value.getContext("2d");
    // console.log(ctx);
    // draw();
    // drawRoundedRect(0, 0, 72, 32, 12, 6);
    drawContinuousGradient(points, "tutorial");
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