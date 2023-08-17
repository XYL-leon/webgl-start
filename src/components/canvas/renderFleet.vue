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

onMounted(() => {
  init();
  draw({ x: 150, y: 150 }, 0);
});
</script>

<template>
  <canvas ref="container" width="300" height="300"></canvas>
  <div class="box"></div>
</template>

<style>
canvas {
  width: 300px;
  height: 300px;
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
