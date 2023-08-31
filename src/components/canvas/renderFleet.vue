<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
var canvas, ctx;

function init() {
  canvas = container.value;
  ctx = canvas.getContext("2d");
}
function draw(point, rotate) {
  ctx.save();
  ctx.translate(point.x, point.y);

  ctx.rotate((Math.PI / 180) * rotate);

  ctx.beginPath();
  ctx.lineWidth = 0.7;

  // ctx.moveTo(0, -10);
  // ctx.lineTo(5, 9);
  // ctx.lineTo(-5, 9);
  // ctx.lineTo(0, -10);

  ctx.moveTo(0, -20);
  ctx.lineTo(0, -10);
  ctx.lineTo(5, 9);
  ctx.lineTo(-5, 9);
  ctx.lineTo(0, -10);

  // ctx.moveTo(-1, -9);
  // ctx.lineTo(7, -1);
  // ctx.lineTo(-1, 7);
  // ctx.lineTo(-9, -1);
  // ctx.lineTo(-1, -9);

  ctx.fillStyle = "rgb(255,0,0)";
  ctx.fill();
  ctx.strokeStyle = "rgb(20, 24, 26)";
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}
// 船舶长、宽
function drawShipBreadthAndLength(point, rotate) {
  // const breadth = 20;
  // const length = 136;
  const breadth = 60;
  const length = 333;
  const sternLength = length / 25;
  const bowLength = length / 8; // 船首
  const bodyLength = length - sternLength - bowLength;
  // const sternAndBowLength = sternLength + bowLength;
  // const breadth = 26;
  // const length = 108;
  // const breadth = 32 *2;
  // const length = 74 *2;
  ctx.save();
  ctx.translate(point.x, point.y);

  ctx.rotate((Math.PI / 180) * rotate);

  ctx.beginPath();
  ctx.lineWidth = 0.7;

  // // 尾部
  // ctx.moveTo(-breadth / 2, -length / 2);
  // ctx.lineTo(breadth / 2, -length / 2);
  // // 首
  // ctx.lineTo(breadth / 2, length / 2);
  // ctx.lineTo(-breadth / 2, length / 2);

  /**
   * 0度向南
   * */
  // // 尾部
  // ctx.moveTo(-breadth / 2, -length / 2);
  // ctx.lineTo(-(breadth / 4), -(length / 2 + length / 25));
  // ctx.lineTo(breadth / 4, -(length / 2 + length / 25));
  // ctx.lineTo(breadth / 2, -length / 2);
  // // 首
  // ctx.lineTo(breadth / 2, length / 2);
  // ctx.lineTo(breadth / 5, length / 2 + length / 10);
  // ctx.lineTo(0, length / 2 + length / 8);
  // ctx.lineTo(-breadth / 5, length / 2 + length / 10);
  // ctx.lineTo(-breadth / 2, length / 2);

  /**
   * 0度向北
   * */
  // 尾部
  ctx.moveTo(-breadth / 2, bodyLength / 2);
  ctx.lineTo(-(breadth / 4), bodyLength / 2 + sternLength);
  ctx.lineTo(breadth / 4, bodyLength / 2 + sternLength);
  ctx.lineTo(breadth / 2, bodyLength / 2);
  // 首
  ctx.lineTo(breadth / 2, -bodyLength / 2);
  ctx.lineTo(breadth / 5, -(bodyLength / 2 + length / 10));
  ctx.lineTo(0, -(bodyLength / 2 + bowLength));

  // 航行状态
  if (true) {
    ctx.lineTo(0, -(bodyLength / 2 + bowLength + 20));
    ctx.lineTo(0, -(bodyLength / 2 + bowLength));
  }

  ctx.lineTo(-breadth / 5, -(bodyLength / 2 + length / 10));
  ctx.lineTo(-breadth / 2, -bodyLength / 2);

  ctx.lineTo(-breadth / 2, bodyLength / 2);

  ctx.fillStyle = "rgb(255,0,0)";
  ctx.fill();
  ctx.strokeStyle = "rgb(20, 24, 26)";
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}

onMounted(() => {
  init();
  // draw({ x: 150, y: 150 }, 0);
  // drawShipBreadthAndLength({ x: 250, y: 250 }, 223);
  drawShipBreadthAndLength({ x: 250, y: 250 }, 0);
});
</script>

<template>
  <canvas ref="container" width="500" height="500"></canvas>
  <div class="box"></div>
</template>

<style>
canvas {
  width: 500px;
  height: 500px;
  border: 1px solid red;
  margin: 100px;
}
.box {
  position: fixed;
  left: 235px;
  top: 235px;
  z-index: 1;
  width: 30px;
  height: 30px;
  border: 1px solid red;
}
</style>
