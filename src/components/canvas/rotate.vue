
<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
var canvas, ctx;
function init() {
  canvas = container.value;
  ctx = canvas.getContext("2d");
  draw();
}
function draw() {
  //初始的样式（绘制状态）并绘制矩形
  ctx.fillStyle = "#FA6900";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(204, 25, 255, 0.5)";
  ctx.fillRect(5, 5, 100, 200);

  ctx.save(); //保存上述设置的绘制状态
  //重新定义新的绘制状态，并绘制矩形
  ctx.fillStyle = "#E0E4CD";
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(204, 204, 204, 0.5)";
  ctx.fillRect(50, 50, 100, 260);
  //绘制完之后，恢复到初始的绘制状态，继续进行绘画。并绘制圆形，并不会恢复初始状态下绘制的矩形。
  ctx.restore();

  ctx.beginPath();
  ctx.arc(300, 300, 20, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  ctx.save(); // 1 保存正常的坐标系
  ctx.translate(240, 50);   // 2 改变坐标系位置
  ctx.rotate(45);   // 3 旋转坐标系
  ctx.fillStyle = "red";
  ctx.font = "60px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("你好，世界！", 0, 0);
  ctx.restore(); // 4 从栈中取出之前保存的状态
}
onMounted(() => {
  init();
});
</script>

<template>
  <canvas ref="container" width="500" height="500"></canvas>
</template>

<style>
canvas {
  width: 500px;
  height: 500px;
  margin: 50px 0 0;
  border: 1px solid #000;
  color: rgb(0, 237, 249);
}
</style>