<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

function draw() {
  var canvas = container.value;
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        ctx.beginPath();
        var x = 25 + j * 50; // x 坐标值
        var y = 25 + i * 50; // y 坐标值
        var radius = 20; // 圆弧半径
        var startAngle = 0; // 开始点
        var endAngle = Math.PI + (Math.PI * j) / 2; // 结束点
        var anticlockwise = i % 2 == 0 ? false : true; // 顺时针或逆时针
        console.log(j, i, endAngle, anticlockwise);
        ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

        if (i > 1) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }
  }
}
onMounted(() => {
  draw();
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