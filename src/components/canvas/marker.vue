<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

/**
 * 吉祥智慧生态气象服务平台 3D marker
 * */ 
// 纵向 ➢
// function draw() {
//   // ctx.fillStyle = "rgba(200,0,0,1)";
//   // ctx.fillRect(10, 10, 55, 50);

//   let width = 14;
//   let height = 14;

//   console.log(Math.ceil(height / 3));
//   ctx.beginPath();
//   ctx.moveTo(0, 0);
//   ctx.lineTo(width / 2, Math.ceil(height / 5));
//   ctx.lineTo(width, 0);
//   ctx.lineTo(width / 2, height);
//   ctx.lineTo(0, 0);

//   // background: linear-gradient(177.33deg, #43CE19 2.11%, rgba(67, 206, 25, 0.32) 101.67%);
//   // 计算渐变线的长度（取画布对角线以确保覆盖整个矩形）
//   const length = Math.sqrt(width * width + height * height);

//   // ctx.strokeStyle = "rgba(200,0,0,1)";
//   // ctx.stroke();

//   // 将角度转换为弧度
//   const radians = (-90 * Math.PI) / 180;
//   // 计算渐变的起始点和结束点
//   const startX = width / 2 - (Math.cos(radians) * length) / 2;
//   const startY = height / 2 - (Math.sin(radians) * length) / 2;
//   const endX = width / 2 + (Math.cos(radians) * length) / 2;
//   const endY = height / 2 + (Math.sin(radians) * length) / 2;
//   debugger;
//   const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
//   gradient.addColorStop(0, "#43CE19");
//   gradient.addColorStop(1, "rgba(67, 206, 25, 0.32)");

//   // 应用渐变并绘制矩形
//   ctx.fillStyle = gradient;
//   ctx.fill();
// }
function draw() {
  let color = "#43CE19";
  let color1 = "rgba(67, 206, 25, 0.12)";

  const Ratio = window.devicePixelRatio;

  let width = 56 * Ratio;
  let height = 24 * Ratio;
  let x = 1 * Ratio;

  ctx.save();
  // 矩形
  ctx.beginPath();
  ctx.moveTo(width / 5 + x, 0 + x);
  ctx.lineTo(width + x, 0 + x);
  ctx.lineTo(width + x, height / 2 + x);
  ctx.lineTo(width - width / 5 + x, height + x);
  ctx.lineTo(0 + x, height + x);
  ctx.lineTo(0 + x, height / 2 + x);
  ctx.lineTo(width / 5 + x, 0 + x);
  ctx.strokeStyle = color;
  ctx.stroke();

  // 计算渐变线的长度（取画布对角线以确保覆盖整个矩形）
  const length = Math.sqrt(width * width + height * height);
  // 将角度转换为弧度
  const radians = (90 * Math.PI) / 180;
  // 计算渐变的起始点和结束点
  const startX = width / 2 - (Math.cos(radians) * length) / 2;
  const startY = height / 2 - (Math.sin(radians) * length) / 2;
  const endX = width / 2 + (Math.cos(radians) * length) / 2;
  const endY = height / 2 + (Math.sin(radians) * length) / 2;
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, color1);
  ctx.restore();

  // 应用渐变并绘制矩形
  ctx.fillStyle = gradient;
  ctx.fill();
  // -------------
  let _width = 14 * Ratio;
  let _height = 14 * Ratio;
  let margin = 4 * Ratio;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width / 2 + x, height + Math.ceil(_height / 5) + margin + x);
  ctx.lineTo(width / 2 + _width / 2 + x, height + margin + x);
  ctx.lineTo(width / 2 + x, height + _height + margin + x);
  ctx.lineTo(width / 2 - _width / 2 + x, height + margin + x);
  ctx.lineTo(width / 2 + x, height + Math.ceil(_height / 5) + margin + x);
  ctx.strokeStyle = color;
  ctx.stroke();

  // 计算渐变线的长度（取画布对角线以确保覆盖整个矩形）
  const _length = Math.sqrt(_width * _width + _height * _height);
  // 将角度转换为弧度
  const _radians = (-90 * Math.PI) / 180;
  // 计算渐变的起始点和结束点
  const _startX =
    _width / 2 - (Math.cos(_radians) * _length) / 2 + (width / 2 - _width / 2);
  const _startY = _height / 2 - (Math.sin(_radians) * _length) / 2 + (height + x);
  const _endX =
    _width / 2 + (Math.cos(_radians) * _length) / 2 + (width / 2 - _width / 2);
  const _endY = _height / 2 + (Math.sin(_radians) * _length) / 2 + (height + x);
  const _gradient = ctx.createLinearGradient(_startX, _startY, _endX, _endY);
  _gradient.addColorStop(0, "#43CE19");
  _gradient.addColorStop(1, "rgba(67, 206, 25, 0.32)");
  // 应用渐变并绘制矩形
  ctx.fillStyle = _gradient;
  ctx.fill();
  ctx.restore();
}

onMounted(() => {
  if (container.value.getContext) {
    // 获取渲染上下文和绘制功能;
    ctx = container.value.getContext("2d");
    // console.log(ctx);
    draw();
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
  /* border: 1px solid black; */
  width: 500px;
  height: 500px;
  margin: 30px auto 0;
  box-shadow: 0 0 3px #000;
}
</style>
