<script setup>
import WebGL from "./components/webgl.vue";

import CanvasRotate from "./components/canvas/rotate.vue";
import CanvasRect from "./components/canvas/rect.vue";
import CanvasLine from "./components/canvas/line.vue";
import CanvasCircle from "./components/canvas/circle.vue";
</script>

<template>
  <div class="container">
    <CanvasCircle />
    <CanvasLine />
    <CanvasRect />
    <WebGL />
    <CanvasRotate />
  </div>
</template>
