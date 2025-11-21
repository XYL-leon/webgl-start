<template>
  <!-- 用于挂载图表的容器 -->
  <div ref="plotContainer1" class="volcano_raster"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Plot from "@observablehq/plot";
import volcano from "./volcano.json";

// 定义图表容器的 ref
const plotContainer1 = ref(null);

// 模拟数据

onMounted(() => {
  // 确保容器已挂载
  if (plotContainer1.value) {
    // 创建
    const plot = Plot.plot({
      aspectRatio: 1,
        color: {
          label: "Elevation (m)",
          legend: true,
          // scheme: "BuRd",
          scheme: "Inferno",
        },
      marks: [
        Plot.raster(volcano.values, { width: volcano.width, height: volcano.height }),
      ],
    });

    // 将图表渲染到容器中
    plotContainer1.value.appendChild(plot);
  }
});
</script>

<style scoped>
.plot-container {
  margin: 20px;
}
</style>
