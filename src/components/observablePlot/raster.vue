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
import temp from "./temp-11191647.json"; // 温度数据
// import rhu from "./rhu-11181715.json";
import rhu from "./rhu-11182128.json";
import jilin from "./jilin_province_boundary.json";

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
  if (!plotContainer.value) return;

  // --------------------------
  // 步骤1：处理吉林边界数据（若为TopoJSON需转换）
  // --------------------------

  // --------------------------
  // 步骤2：筛选吉林境内的数据
  // --------------------------
  console.log(temp.data);
  var _data = temp.data.filter((item) => item.value !== null);
  _data.map((item) => {
    item.value = +item.value;
    if (item.value < -16) console.log(item.value, item.stationName, item.stationIdC);
  });
  console.log(_data);
  // var f = _data.filter(item=>item.value<=-20)
  // console.log(f)
  // --------------------------
  // 步骤3：绘制图表（强制吉林区域充满视图）
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
  console.log(colorDomain, colorRange);
  const plot = Plot.plot({
    // 视图尺寸（与容器一致）
    width: 1062,
    height: 598,

    // 投影配置：强制吉林边界充满视图
    projection: {
      type: "equirectangular", // 适配中国区域的投影
      domain: jilin,
    },

    marks: [
      Plot.raster(_data, {
        x: "lon",
        y: "lat",
        fill: "value",
        interpolate: "random-walk",
        blur: 5,
      }).plot({ color: { type: "diverging" } }),

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
  // svg {
  //   width: 100%;
  //   height: 100%;
  //   display: block; /* 消除SVG默认的行内元素留白 */
  // }
}
</style>
