<template>
  <h3 class="subtitle">Contour mark</h3>
  <div ref="plotContainer" class="jilin-visualization"></div>
</template>

<script setup>
/**
 * 注意：
 * 1. 不设置blur时每个点都具有颜色范围
 * 2. 图例阈值等差或可熵减
 * */

/**
 * 1. 将数据按照阈值切割分组，那么实际渲染效果将直接跟阈值绑定而不是跟数据本身绑定
 * 2. interval是将阈值按照什么精度切割分组。当一组数据存在差值较大时，会影响计算性能。如降水图例，最大值为200，最小有效值为0.1，此时interval设置为0.1，则会生成2000个分组，计算量较大，渲染性能会下降。这种情况在设置stroke时同样会有影响，表现时峰值和谷值处会出现多条等高线重叠的现象，影响视觉效果。
 * */

import { ref, onMounted } from "vue";
import * as Plot from "@observablehq/plot";
import jilin from "./jilin_province_boundary.json";
import { RhuLegend } from "./legends.js";
import axios from "axios";

const plotContainer = ref(null);

async function render() {
  // const st = "2025-12-23+06:10:00";
  // const et = "2025-12-23+08:10:00";
  const st = "2026-01-11+09:00:00";
  const et = "2026-01-12+09:00:00";
  // const url = `http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/statisticalDataByTime?cntyCode=220000&siteTypeCode=1,2&code=statistical_pre_accumulate&startTime=${st}&endTime=${et}`;
  const url =
    "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/liveData?cntyCode=220000&siteTypeCode=1&elementsCode=rhu&code=rhu_relative";
  const res = await axios.get(url);

  // const res = { data: { data: pre260107.data } };
  if (!plotContainer.value) return;
  // var _data = res.data.data.filter((item) => +item.value);
  let _data = res.data.data.map((item) => {
    item.value = +item.value;
    return item;
  });
  let filteredData = _data.filter((item) => +item.value);
  // filteredData.forEach((item) => {
  //   if (item.value === 0) console.log(item);
  // });

  const colorDomain = RhuLegend.colors.map((item) => item[0]);
  const colorRange = RhuLegend.colors.map((item) => item[1]);
  colorRange.unshift(RhuLegend.colors[0][1]);

  console.time("time");
  const plot = Plot.plot({
    width: 1960,
    height: 1028,
    projection: {
      type: "equirectangular",
      domain: jilin,
    },
    color: {
      label: "降水量 (°C)",
      type: "threshold", // linear ordinal threshold
      domain: colorDomain,
      range: colorRange,
      legend: true,
    },
    marks: [
      Plot.contour(filteredData, {
        // smooth: true,
        x: "lon",
        y: "lat",
        fill: "value",
        interval: 1, // 等高线间隔（根据数据调整）
        blur: 0.5, // 只有省站
        // stroke: "rgba(0,0,0,0.2)",
        // strokeWidth: 0.5,
        clip: jilin,
        pixelSize: 8,
        // pixelSize: 12 / window.devicePixelRatio,
        // interpolate: "barycentric",
        imageRendering: "smooth", // pixelated
      }),
      Plot.dot(filteredData, {
        x: "lon",
        y: "lat",
        r: 2, // 点大小
        fill: "value", // 用value映射颜色
        stroke: "#000", // 白色边框突出点
        strokeWidth: 0.5,
        channels: { 站名: "stationName", 站号: "stationIdC" },
        tip: true,
      }),
      Plot.dot(filteredData, Plot.pointer({ x: "lon", y: "lat", fill: "red", r: 8 })),
      Plot.text(filteredData, {
        x: "lon",
        y: "lat",
        text: "value", // 要显示的文字字段
        fill: "black",
        fontSize: 12,
        dx: 6, // 文字相对于圆点的x偏移（向右6px）
        dy: 0, // 文字相对于圆点的y偏移（向下3px）
        textAnchor: "start", // 文字对齐方式
      }),
      // 2. 吉林边界线（红色强调）
      Plot.geo(jilin, {
        stroke: "#ff3333",
        strokeWidth: 1.5,
        fill: "none",
      }),
    ],
  });
  console.timeEnd("time");
  plotContainer.value.appendChild(plot);
}

onMounted(() => {
  render();
});
</script>

<style lang="scss" scoped>
.jilin-visualization {
  margin: 0 auto;
}
</style>
