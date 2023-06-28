<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

function drawPort(label, lineColor, iconBG) {
  var canvas = container.value;
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");

    ctx.font = "12px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const textMetrics = ctx.measureText(label);
    const textWidth =
      Math.ceil(
        textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft
      ) + 10;

    console.log(textWidth);
    // const width = textWidth < 58 ? 58 : textWidth;
    const width = 108;
    const height = 32;
    const margin = 5;
    const radius = height / 2;
    ctx.fillStyle = iconBG;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 32;
    ctx.lineJoin = "round";
    ctx.moveTo(margin + radius, height / 2 + margin);
    ctx.lineTo(width + margin + radius, height / 2 + margin);
    ctx.closePath();
    ctx.stroke();

    // 上横线
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;

    ctx.beginPath();
    ctx.moveTo(margin + radius, margin);
    ctx.lineTo(width + margin + radius, margin);
    ctx.stroke();

    // 下横线加三角
    ctx.beginPath();
    ctx.moveTo(margin + radius, height + margin);
    ctx.lineTo(width / 2 + margin - 5 + radius, height + margin);
    ctx.lineTo((width + margin * 2) / 2 + radius, height + margin + 10);
    ctx.lineTo(width / 2 + margin + 5 + radius, height + margin);
    ctx.lineTo(width + margin + radius, height + margin);
    ctx.stroke();

    // 左侧半圆
    ellipse(
      ctx,
      margin + radius,
      height / 2 + margin,
      radius,
      radius,
      Math.PI / 2
    );
    // 右侧半圆
    ellipse(
      ctx,
      width + margin + radius,
      height / 2 + margin,
      radius,
      radius,
      -Math.PI / 2
    );

    // icon
    ctx.beginPath();
    ctx.arc(margin + radius, height / 2 + margin, 12, 0, 360, false);
    ctx.fill();

    // ctx.drawImage(img, 0, 0, 24, 24);

    // 文字
    ctx.fillText(
      label,
      width / 2 + margin + radius + 10,
      height / 2 + margin + 2
    );
  }
}
function ellipse(context, x, y, a, b, rotate) {
  context.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  const r = a > b ? a : b;
  const ratioX = a / r;
  const ratioY = b / r;
  context.scale(ratioX, ratioY);
  context.beginPath();
  context.arc(0, 0, r, 0, Math.PI, false);
  context.restore();
  ctx.stroke();
}

onMounted(() => {
  const label = "12.4m/s";
  const lineColor = "rgba(255,0,0,0.5)";
  const iconBG = "rgba(255,0,0,0.5)";
  drawPort(label, lineColor, iconBG);
});
</script>

<template>
  <canvas id="tutorial" ref="container" width="150" height="52"> </canvas>
</template>
<style scoped>
#tutorial {
  display: block;
  /* border: 1px solid black; */
  border: 0;
  width: 150px;
  height: 52px;
  margin: 100px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: rgb(77, 228, 72);
}
</style>