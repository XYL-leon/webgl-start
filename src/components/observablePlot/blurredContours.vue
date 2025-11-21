<template>
  <div ref="plotContainer" class="jilin-visualization"></div>
</template>

<script setup>
/**
 * 待解决问题：
 * 1.
 * */
import { ref, onMounted } from "vue";
import * as Plot from "@observablehq/plot";
// import temp from "./temp-11181742.json"; // 温度数据
// import temp from "./temp-11182136.json"; // 温度数据
// import temp from "./temp-max-11191636.json"; // 温度数据
// import temp from "./temp-11191647.json"; // 温度数据
import temp from "./temp-11191730.json"; // 温度数据
// import rhu from "./rhu-11181715.json";
import rhu from "./rhu-11182128.json";
import jilin from "./jilin_province_boundary.json";
import axios from "axios";

const plotContainer = ref(null);
const RhuLegend = {
  name: "相对湿度",
  label: "相对湿度",
  unit: "%",
  colors: [
    [0, "rgb(173, 85, 56)"],
    [30, "rgb(173, 110, 56)"],
    [40, "rgb(173, 146, 56)"],
    [50, "rgb(105, 173, 56)"],
    [60, "rgb(56, 173, 121)"],
    [70, "rgb(56, 174, 173)"],
    [75, "rgb(56, 160, 173)"],
    [80, "rgb(56, 157, 173)"],
    [83, "rgb(56, 148, 173)"],
    [87, "rgb(56, 135, 173)"],
    [90, "rgb(56, 132, 173)"],
    [93, "rgb(56, 123, 173)"],
    [97, "rgb(56, 98, 157)"],
    [100, "rgb(56, 70, 114)"],
  ],
  // colors: [
  //   [0, "#AD5538"],
  //   [30, "#AD6E38"],
  //   [40, "#AD9238"],
  //   [50, "#69AD38"],
  //   [60, "#38AD79"],
  //   [70, "#38AEAD"],
  //   [75, "#38A0AD"],
  //   [80, "#389DAD"],
  //   [83, "#3894AD"],
  //   [87, "#3887AD"],
  //   [90, "#3884AD"],
  //   [93, "#387BAD"],
  //   [97, "#38629D"],
  //   [100, "#384672"],
  // ],
};
const TempLegend = {
  name: "温度",
  label: "温度",
  unit: "℃",
  colors: [
    // 开始：小于 中间：左闭右开 结束：大于等于
    [-36, "rgb(117,26,120)"],
    [-32, "rgb(11,49,129)"],
    [-28, "rgb(44,93,161)"],
    [-24, "rgb(56,118,204)"],
    [-20, "rgb(87,160,234)"],
    [-16, "rgb(138,206,251)"],
    [-12, "rgb(175,253,244)"],
    [-8, "rgb(201,248,254)"],
    [-4, "rgb(245,255,255)"],
    [0, "rgb(229,254,220)"],
    [4, "rgb(208,253,190)"],
    [8, "rgb(201,251,146)"],
    [12, "rgb(253,253,168)"],
    [16, "rgb(253,243,201)"],
    [20, "rgb(250,221,175)"],
    [24, "rgb(244,178,127)"],
    [28, "rgb(238,141,136)"],
    [32, "rgb(220,101,100)"],
    [35, "rgb(236,72,63)"],
    [37, "rgb(185,38,26)"],
    [40, "rgb(142,58,22)"],
  ],
};

onMounted(async () => {
  const url =
    "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/liveData?cntyCode=220000&siteTypeCode=1,2&elementsCode=temp&code=temp_real";
  const res = await axios.get(url);

  if (!plotContainer.value) return;
  var _data = res.data.data.filter((item) => item.value !== null);
  _data.map((item) => {
    item.value = +item.value;
    // if (item.value < -16) console.log(item.value, item.stationName, item.stationIdC);
  });
  // _data.map((item) => {
  //   if (item.stationIdC === "54287") {
  //     console.log(item.value);
  //     // item.value = 0;
  //   }
  //   if(item.stationIdC ==='E3890'){
  //     // item.value = 0
  //   }
  //   if(item.stationIdC ==='E3749'){
  //     // item.value = 0;
  //   }
  // });
  console.log(res.data.data.length, _data.length);

  // --------------------------
  // 吉林省范围 minlon minlat maxlon maxlat
  // const jilinBounds = [
  //   121.63631406744048,
  //   40.861962084282936,
  //   131.309243211605,
  //   46.3023489205662,
  // ];

  const colorDomain = TempLegend.colors.map((item) => item[0]);
  const colorRange = TempLegend.colors.map((item) => item[1]);

  colorRange.unshift(TempLegend.colors[0][1])
  // colorRange.push("rgb(255,255,0)");

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
        x: "lon",
        y: "lat",
        fill: "value",
        interval: 4, // 等高线间隔（根据数据调整）
        blur: 0.3,
        stroke: "rgba(0,0,0,0.2)",
        strokeWidth: 0.5,
        clip: jilin,
      }),
      Plot.dot(_data, {
        x: "lon",
        y: "lat",
        r: 2, // 点大小
        fill: "value", // 用value映射颜色
        stroke: "#fff", // 白色边框突出点
        strokeWidth: 0.5,
      }),

      // 2. 吉林边界线（红色强调）
      Plot.geo(jilin, {
        stroke: "#ff3333",
        strokeWidth: 1.5,
        fill: "none",
      }),
    ],
  });

  // --------------------------
  // 步骤4：渲染到容器
  // --------------------------
  plotContainer.value.appendChild(plot);
});
</script>

<style lang="scss" scoped>
.jilin-visualization {
  width: 800px; /* 与图表width一致 */
  height: 600px; /* 与图表height一致 */
  margin: 0 auto;
}
</style>
