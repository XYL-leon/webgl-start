
<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
var canvas, ctx;
let angle_1 = ref(0);
let angle_2 = ref(0);

let angle_3 = ref(0);
let angle_4 = ref(0);

let angle_5 = ref(0);
let angle_6 = ref(0);

let angle_7 = ref(0);
let angle_8 = ref(0);

function init() {
  canvas = container.value;
  ctx = canvas.getContext("2d");
}
function draw(angle) {
  //初始的样式（绘制状态）并绘制矩形
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(204, 25, 255, 0.5)";

  ctx.save(); // 1 保存正常的坐标系
  ctx.translate(100, 100); // 2 改变坐标系位置
  ctx.rotate((angle * Math.PI) / 180); // 3 旋转坐标系
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("你好，世界！" + angle, 0, 0);
  ctx.restore(); // 4 从栈中取出之前保存的状态
}
// function drawLine(pointA, pointB) {
//   ctx.beginPath();
//   // ctx.moveTo(Math.floor(pointA[0]), Math.floor(pointA[1])); // 将笔触移动到该点
//   // ctx.lineTo(Math.floor(pointB[0]), Math.floor(pointB[1]));
//   // console.log(Math.floor(pointA[0] * 10), Math.floor(pointA[1] * 10));
//   // console.log(Math.floor(pointB[0] * 10), Math.floor(pointB[1] * 10));
//   ctx.moveTo(pointA[0], pointA[1]); // 将笔触移动到该点
//   ctx.lineTo(pointB[0], pointB[1]);
//   ctx.fill();
// }
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
    // 45
    [0, 30],
    [30, 0],
  ];
  // 升序
  // let ccc = [
  //   // -45
  //   [0, 0],
  //   [30, 30],
  // ];
  let ccc = [
    [97.69617, 48.6],
    [97.8, 48.65742],
  ];
  // 第二象限 降序
  let ddd = [
    // 45
    // 45
    [-30, 30],
    [0, 0],
  ];
  // 升序
  let eee = [
    // -45
    [-30, 0],
    [0, 30],
  ];
  // 第三象限 降序
  let fff = [
    // 45
    [-30, 0],
    [0, -30],
  ];
  // 升序
  let ggg = [
    // -45
    [-30, -30],
    [0, 0],
  ];
  // 第四象限 降序
  let hhh = [
    // 45
    [0, 0],
    [30, -30],
  ];
  // 升序 //-45
  let iii = [
    [0, -30],
    [30, 0],
  ];

  // angle_1.value = computeAngle(aaa[0], aaa[1]);
  angle_1.value = computeAngle(bbb[0], bbb[1]);
  angle_2.value = computeAngle(ccc[0], ccc[1]);

  angle_3.value = computeAngle(ddd[0], ddd[1]);
  angle_4.value = computeAngle(eee[0], eee[1]);

  angle_5.value = computeAngle(fff[0], fff[1]);
  angle_6.value = computeAngle(ggg[0], ggg[1]);

  angle_7.value = computeAngle(hhh[0], hhh[1]);
  angle_8.value = computeAngle(iii[0], iii[1]);

  draw(angle_8.value);
  // drawLine(bbb[0], bbb[1]);
  // drawLine(hhh[0], hhh[1]);
});
</script>

<template>
  <canvas ref="container" width="900" height="900"></canvas>
  <ul>
    <!-- <li :style="'transform:rotate(' + angle_1 + 'deg);background:#ff0000;'">
      旋转角度{{ angle_1 }}
    </li> -->
    <li :style="'transform:rotate(' + angle_2 + 'deg);background:#ff0000;'">
      旋转角度{{ angle_2 }}
    </li>
    <!-- <li :style="'transform:rotate(' + angle_3 + 'deg);background:#fff000;'">
      旋转角度{{ angle_3 }}
    </li>
    <li :style="'transform:rotate(' + angle_4 + 'deg);background:#fff000;'">
      旋转角度{{ angle_4 }}
    </li>
    <li :style="'transform:rotate(' + angle_5 + 'deg);background:#00ff00;'">
      旋转角度{{ angle_5 }}
    </li>
    <li :style="'transform:rotate(' + angle_6 + 'deg);background:#00ff00;'">
      旋转角度{{ angle_6 }}
    </li>
    <li :style="'transform:rotate(' + angle_7 + 'deg);background:#00ffff;'">
      旋转角度{{ angle_7 }}
    </li>
    <li :style="'transform:rotate(' + angle_8 + 'deg);background:#00ffff;'">
      旋转角度{{ angle_8 }}
    </li> -->
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