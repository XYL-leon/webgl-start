<template>
  <!-- 用于挂载图表的容器 -->
  <div ref="plotContainer" class="plot-container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Plot from "@observablehq/plot";

// 定义图表容器的 ref
const plotContainer = ref(null);

// 模拟数据
const data = [
  { category: "A", value: 10 },
  { category: "B", value: 20 },
  { category: "C", value: 15 },
  { category: "D", value: 25 },
];

onMounted(() => {
  var alphabet = [
    { letter: "A", frequency: 0.08167 },
    { letter: "B", frequency: 0.01492 },
    { letter: "C", frequency: 0.02782 },
  ];
  // 确保容器已挂载
  if (plotContainer.value) {
    // 创建柱状图
    const plot = Plot.plot({
      y: {
        grid: true,
        percent: true,
      },
      marks: [
        Plot.ruleY([0]),
        Plot.barY(alphabet, {
          x: "letter",
          y: "frequency",
          sort: { x: "y", reverse: true },
        }),
      ],
    });

    // 将图表渲染到容器中
    plotContainer.value.appendChild(plot);
  }
});
</script>

<style scoped>
.plot-container {
  margin: 20px;
}
</style>
