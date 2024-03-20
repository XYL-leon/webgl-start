<script setup>
import { ref, onMounted, provide } from "vue";
import Demo from "./demo.vue";
import Start from "./modules/start.vue";
import TWOD from "./modules/2d.vue";

const canvasContainer = ref(null);
let gl = ref();
provide("gl", gl);

onMounted(() => {
  gl.value = canvasContainer.value.getContext("webgl");
});
</script>
<template>
  <canvas ref="canvasContainer" class="webgl" width="500" height="500"></canvas>
  <!-- <Demo />
  <Start /> -->
  <TWOD />
</template>
