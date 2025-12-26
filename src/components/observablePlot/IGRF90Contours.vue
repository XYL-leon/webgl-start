<template>
  <div ref="plotContainer" class="jilin-visualization"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Plot from "@observablehq/plot";
import jilin from "./jilin_province_boundary.json";
import axios from "axios";

const plotContainer = ref(null);
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
    [36, "rgb(236,72,63)"],
    [40, "rgb(142,58,22)"],

    // [-36, "rgb(117,26,120)"],
    // [-32, "rgb(11,49,129)"],
    // [-28, "rgb(44,93,161)"],
    // [-24, "rgb(56,118,204)"],
    // [-20, "rgb(87,160,234)"],
    // [-16, "rgb(138,206,251)"],
    // [-12, "rgb(175,253,244)"],
    // [-8, "rgb(201,248,254)"],
    // [-4, "rgb(245,255,255)"],
    // [0, "rgb(229,254,220)"],
    // [4, "rgb(208,253,190)"],
    // [8, "rgb(201,251,146)"],
    // [12, "rgb(253,253,168)"],
    // [16, "rgb(253,243,201)"],
    // [20, "rgb(250,221,175)"],
    // [24, "rgb(244,178,127)"],
    // [28, "rgb(238,141,136)"],
    // [32, "rgb(220,101,100)"],
    // [35, "rgb(236,72,63)"],
    // [37, "rgb(185,38,26)"],
    // [40, "rgb(142,58,22)"],
  ],
};

onMounted(async () => {
  const url =
    "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/liveData?cntyCode=220000&siteTypeCode=1&elementsCode=temp&code=temp_real";
  const res = await axios.get(url);

  if (!plotContainer.value) return;
  var _data = res.data.data.filter((item) => item.value !== null);
  _data.map((item) => {
    item.value = Math.abs(+item.value);
    console.log(item.value)
  });

  const plot = Plot.contour(_data, {
    x: "lon",
    y: "lat",
    fill: "value",
    clip: jilin,
  }).plot({
    color: { type: "diverging" },
  });
  plotContainer.value.appendChild(plot);
});
</script>

<style lang="scss" scoped>
.jilin-visualization {
  margin: 0 auto;
}
</style>
