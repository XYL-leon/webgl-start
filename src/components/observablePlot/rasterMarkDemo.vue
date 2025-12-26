<template>
  <h3 class="subtitle">Raster mark</h3>
  <h4>Interpolate method {{ interpolateMethod }}</h4>
  <div ref="plotContainer" class="jilin-visualization"></div>
</template>

<script setup>
/**
 * 注意：
 * 1. 不设置blur时每个点都具有颜色范围
 * 2. 图例阈值等差或可熵减
 * */

import { ref, onMounted } from "vue";
import * as Plot from "@observablehq/plot";
import temp from "./temp-11181742.json"; // 温度数据
import temp1 from "./temp-11182136.json"; // 温度数据
import temp2 from "./temp-max-11191636.json"; // 温度数据
import temp3 from "./temp-11191647.json"; // 温度数据
import temp4 from "./temp-11191730.json"; // 温度数据
// import rhu from "./rhu-11181715.json";
// import rhu from "./rhu-11182128.json";
import jilin from "./jilin_province_boundary.json";
import { TempLegend } from "./legends";
import axios from "axios";

const list = [temp, temp1, temp2, temp3, temp4];
const plotContainer = ref(null);
const interpolateMethods = [
  // "bilinear", // 双线性插值
  // "bicubic",  // 双立方插值
  "barycentric", // 重心插值
  // "catmull-rom", // Catmull-Rom样条插值
  // "hermite", // Hermite样条插值
  // "linear", // 线性插值
  // "monotone", // 单调插值
  // "natural", // 自然邻域插值
  "nearest", // 最近邻插值
  "random-walk", // 随机游走插值
];
const interpolateMethod = interpolateMethods[1];

function render(index) {
  // let dom = document.getElementsByTagName("svg")[0];
  // if (dom) {
  //   dom.remove();
  // }
  // setTimeout(() => {
  // }, 1000);
  // const url =
  //   "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/liveData?cntyCode=220000&siteTypeCode=1,2&elementsCode=temp&code=temp_real";
  // const res = await axios.get(url);

  const res = { data: list[index] };
  if (!plotContainer.value) return;
  var _data = res.data.data.filter((item) => item.value !== null);
  _data.map((item) => {
    item.value = Math.ceil(+item.value);
    // item.value = Math.abs(+item.value);
    // console.log(item.value);
  });

  const colorDomain = TempLegend.colors.map((item) => item[0]);
  const colorRange = TempLegend.colors.map((item) => item[1]);

  colorRange.unshift(TempLegend.colors[0][1]);

  console.time("time");
  const plot = Plot.plot({
    // 视图尺寸（与容器一致）
    width: 1062,
    height: 598,

    // 投影配置：强制吉林边界充满视图
    projection: {
      type: "equirectangular", // 适配中国区域的投影
      domain: jilin,
    },

    // 颜色配置（适配温度数据）
    color: {
      // scheme: "viridis", // 适合温度的渐变色
      label: "温度 (°C)",
      type: "threshold", // linear ordinal threshold
      domain: colorDomain,
      range: colorRange,
      legend: false,
    },
    // color: {
    //   type: "diverging",
    // },

    marks: [
      // 1. 等高线热力图
      // Plot.contour(_data, {
      //   // smooth: false,
      //   x: "lon",
      //   y: "lat",
      //   fill: "value",
      //   interval: 4, // 等高线间隔（根据数据调整）
      //   // blur: 0.1,
      //   stroke: "rgba(0,0,0,0.2)",
      //   strokeWidth: 0.5,
      //   clip: jilin,
      // }),
      Plot.raster(_data, {
        x: "lon",
        y: "lat",
        fill: "value",
        interpolate: interpolateMethod,
        // interpolate: 'none', // 将每个样本分配给包含它的像素,可配合pixelSize使用
        pixelSize: 2,
        // blur: 5,
        clip: jilin,
      }),
      // .plot({ color: { type: "diverging" } }),

      // Plot.dot(_data, {
      //   x: "lon",
      //   y: "lat",
      //   r: 2, // 点大小
      //   fill: "value", // 用value映射颜色
      //   stroke: "#000", // 白色边框突出点
      //   strokeWidth: 0.5,
      // }),

      // 2. 吉林边界线（红色强调）
      Plot.geo(jilin, {
        stroke: "#ff3333",
        strokeWidth: 1.5,
        fill: "none",
      }),
    ],
  });
  console.timeEnd("time");
  console.log(plot);
  // --------------------------
  // 步骤4：渲染到容器
  // --------------------------
  plotContainer.value.appendChild(plot);
}
onMounted(async () => {
  // let index = 0;
  // setInterval(() => {
  //   index = (index + 1) % list.length;
  //   render(index);
  // }, 500);
  render(3);
});
</script>

<style lang="scss" scoped>
.jilin-visualization {
  margin: 0 auto;
}
</style>
