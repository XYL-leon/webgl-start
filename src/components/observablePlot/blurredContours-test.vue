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
import { TempLegend, VisLegend, PreLegend } from "./legends";
import axios from "axios";
import { liveData } from "../../api/meteo";

const list = [temp, temp1, temp2, temp3, temp4];
const plotContainer = ref(null);

// let len;
// let idx=0;
// let handle;
// function update() {
//   console.log(idx)
//   idx++;
//   if (idx >= len) {
//     idx = 0;
//     // cancelAnimationFrame(handle);
//     handle = requestAnimationFrame(update);
//   } else {
//     handle = requestAnimationFrame(update);
//   }
// }

async function render(index) {
  // const Base = "http://10.92.14.202:8790/V1/weather";
  // const st = "2026-01-06+12:00:00",
  //   et = "2026-01-07+08:00:00";
  // const url =
  //   Base +
  //   "/liveBroadcast/stationLive/statisticalDataByTime?cntyCode=220000&siteTypeCode=1,2&code=statistical_pre_accumulate&startTime=" +
  //   st +
  //   "&endTime=" +
  //   et;
  // const res = await axios.get(url);

  // let dom = document.getElementsByTagName("svg")[0];
  // if (dom) {
  //   dom.remove();
  // }
  // const url = "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/liveData?cntyCode=220000&siteTypeCode=1,2&elementsCode=pre&code=pre_real";
  // const url = "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/statisticalDataByTime?cntyCode=220000&siteTypeCode=1,2&code=statistical_pre_accumulate&startTime=2025-12-23+06:10:00&endTime=2025-12-23+08:10:00";
  // const url =
  //   "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/statisticalDataByTime?cntyCode=220000&siteTypeCode=1,2&code=statistical_pre_accumulate&startTime=2026-01-06+12:00:00&endTime=2026-01-07+08:00:00";
  // const res = await axios.get(url);
  const res = await liveData({
    cntyCode: 220000,
    siteTypeCode: 1,
    elementsCode: "temp",
    code: "temp_real",
  });
  console.log(res.data.data);

  // const res = { data: list[index] };
  if (!plotContainer.value) return;
  var _data = res.data.data.filter((item) => +item.value);
  console.log(_data);
  // _data.map((item) => {
  //   item.value = Math.ceil(+item.value);
  //   // item.value = Math.abs(+item.value);
  //   // console.log(item.value);
  // });

  const colorDomain = PreLegend.colors.map((item) => item[0]);
  const colorRange = PreLegend.colors.map((item) => item[1]);

  colorRange.unshift(PreLegend.colors[0][1]);

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
      legend: true,
    },

    marks: [
      // 1. 等高线热力图
      Plot.contour(_data, {
        smooth: true,
        x: "lon",
        y: "lat",
        fill: "value",
        interval: 2, // 等高线间隔（根据数据调整）
        blur: 1,
        stroke: "rgba(0,0,0,0.2)",
        strokeWidth: 0.5,
        // clip: jilin,
        pixelSize: 6,
      }),
      Plot.dot(_data, {
        x: "lon",
        y: "lat",
        r: 2, // 点大小
        fill: "value", // 用value映射颜色
        stroke: "#000", // 白色边框突出点
        strokeWidth: 0.5,
      }),
      Plot.text(_data, {
        x: "lon",
        y: "lat",
        text: "value", // 要显示的文字字段
        fill: "black",
        fontSize: 12,
        dx: 6, // 文字相对于圆点的x偏移（向右6px）
        dy: 3, // 文字相对于圆点的y偏移（向下3px）
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
  console.log(plot);
  // --------------------------
  // 步骤4：渲染到容器
  // --------------------------
  plotContainer.value.appendChild(plot);

  var path = document
    .getElementsByClassName("jilin-visualization")[0]
    .getElementsByTagName("svg")[1]
    .getElementsByTagName("g")[0]
    .getElementsByTagName("path");
  console.log(path, path.length);

  // let idx = 0;
  // setInterval(() => {
  //   console.log(idx);
  //   // for (let i = 0; i < path.length; i++) {
  //   //   if (i === idx) {
  //   //     path[i].style.opacity = 0;
  //   //   } else {
  //   //     path[i].style.opacity = 1;
  //   //   }
  //   // }
  //   path[idx].style.opacity = 0;
  //   idx++;
  //   if (idx >= path.length) {
  //     idx = 0;
  //   }
  // }, 500);
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
