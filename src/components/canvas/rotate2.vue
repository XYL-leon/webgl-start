
<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
var canvas, ctx;
let angle_1 = ref(0);

function init() {
  canvas = container.value;
  ctx = canvas.getContext("2d");
}
function draw() {
  //初始的样式（绘制状态）并绘制矩形
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(204, 25, 255, 0.5)";

  ctx.save(); // 1 保存正常的坐标系
  ctx.translate(100, 100); // 2 改变坐标系位置
  ctx.rotate((angle_1.value * Math.PI) / 180); // 3 旋转坐标系
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("你好，世界！" + angle_1.value, 0, 0);
  ctx.restore(); // 4 从栈中取出之前保存的状态
}
function drawLine(pointA, pointB) {
  ctx.beginPath();
  // ctx.moveTo(Math.floor(pointA[0]), Math.floor(pointA[1])); // 将笔触移动到该点
  // ctx.lineTo(Math.floor(pointB[0]), Math.floor(pointB[1]));
  console.log(Math.floor(pointA[0] * 10), Math.floor(pointA[1] * 10));
  console.log(Math.floor(pointB[0] * 10), Math.floor(pointB[1] * 10));
  ctx.moveTo(828, 634); // 将笔触移动到该点
  ctx.lineTo(832, 634);
  ctx.fill();
}
function computeAngle(pointA, pointB) {
  console.log("-------------");
  let angleDeg =
    (Math.atan2(pointA[0] - pointB[0], pointA[1] - pointB[1]) * 180) / Math.PI;
  angleDeg = angleDeg + 90;

  console.log(angleDeg);
  // return 0;
  return angleDeg;
}
onMounted(() => {
  init();
  let aaa = [
    [130, 30],
    [131, 31],
  ];
  /**
   * 象限
   * 二 一
   * 三 四
   * */
  // 第一象限 降序 —_
  let bbb = [
    [82.8, 63.41665],
    [83.2, 63.41303],
  ];
  // angle_1.value = computeAngle(aaa[0], aaa[1]);
  angle_1.value = computeAngle(bbb[0], bbb[1]);
  draw();
  drawLine(bbb[0], bbb[1]);
});
</script>

<template>
  <canvas ref="container" width="900" height="900"></canvas>
  <ul>
    <li :style="'transform:rotate(' + angle_1 + 'deg)'">
      旋转角度{{ angle_1 }}
    </li>
  </ul>
</template>

<style>
canvas {
  width: 900px;
  height: 900px;
  border: 1px solid red;
}
ul {
  position: fixed;
  right: 100px;
  top: 200px;
  width: 100px;
}
ul li {
  background: red;
}
</style>