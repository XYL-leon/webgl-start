<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

function draw() {
  ctx.fillStyle = "rgba(200,0,0,1)";
  ctx.fillRect(10, 10, 55, 50);

  ctx.fillStyle = "rgba(0,0,200,0.5)";
  ctx.fillRect(30, 30, 55, 50);

  ctx.clearRect(35, 35, 20, 20);

  ctx.strokeRect(50, 50, 50, 50);
}

onMounted(() => {
  if (container.value.getContext) {
    // 获取渲染上下文和绘制功能;
    ctx = container.value.getContext("2d");
    console.log(ctx);
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