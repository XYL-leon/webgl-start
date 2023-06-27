<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

function draw() {
  ctx.beginPath();
  ctx.moveTo(175, 50); // 将笔触移动到该点
  ctx.lineTo(200, 75);
  ctx.lineTo(200, 25);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 绘制
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, 0, Math.PI, false); // 口 (顺时针)
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // 左眼
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // 右眼
  ctx.stroke();

  // 填充三角形
  ctx.beginPath();
  ctx.moveTo(25, 25);
  ctx.lineTo(105, 25);
  ctx.lineTo(25, 105);
  ctx.fill();

  // 描边三角形
  ctx.beginPath();
  ctx.moveTo(125, 125);
  ctx.lineTo(125, 45);
  ctx.lineTo(45, 125);
  ctx.closePath();
  ctx.stroke();
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
  border: 1px solid black;
  width: 500px;
  height: 500px;
}
</style>