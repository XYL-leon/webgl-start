<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

var chart = null;

function render(seriesData1, seriesData2, seriesData3, levels) {
  const option = {
    legend: {
      data: ["Altitude (km) vs. temperature (°C)"],
    },
    tooltip: {
      trigger: "axis",
      formatter: "Temperature : <br/>{b}km : {c}°C",
    },
    grid: [
      {
        top: "6%",
        right: "23%",
        // right: "45%",
        bottom: "6%",
        left: "1%",
        containLabel: true,
      },
      { top: "6%", right: "3%", bottom: "6%", left: "80%", containLabel: true },
    ],
    xAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value}",
        },
        min: -120,
        max: 50,
        interval: 10,
        splitLine: {
          show: true,
          lineStyle: {
            color: [
              "#000",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#000",
            ],
          },
        },
        gridIndex: 0,
      },
      {
        type: "value",
        // type: "category",
        // splitLine: { show: true },
        axisLabel: { show: true },
        interval: 20,
        max: 60,
        splitLine: {
          show: true,
          lineStyle: {
            color: [
              "#000",
              "#ccc",
              "#ccc",
              "#000",
            ],
          },
        },
        gridIndex: 1,
      },
    ],
    yAxis: [
      {
        // type: "category",
        type: "value",
        axisLabel: {
          formatter: "{value}",
        },
        inverse: true,
        interval: 100,
        min: 100,
        max: 1050,
        splitLine: {
          show: true,
          lineStyle: {
            color: [
              "#000",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
            ],
          },
        },
        axisLine: { lineStyle: { color: "#ccc" } },
        splitArea: {
          show: true,
          areaStyle: { color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"] },
        },
        axisTick: {
          show: false,
          lineStyle: { color: "#000" },
        },
        gridIndex: 0,
      },
      {
        // type: "value",
        type: "category",
        position: "right",
        inverse: true,
        // interval: 100,
        // min: 100,
        // max: 1050,
        splitLine: {
          show: true,
          lineStyle: {
            color: [
              "#000",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
              "#ccc",
            ],
          },
        },
        axisLine: { lineStyle: { color: "#000" } },
        splitArea: {
          show: true,
          areaStyle: { color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"] },
        },
        axisTick: {
          show: false,
          lineStyle: { color: "#000" },
        },
        gridIndex: 1,
      },
    ],
    series: [
      {
        name: "Altitude (km) vs. temperature (°C)",
        type: "line",
        symbolSize: 4,
        symbol: "circle",
        smooth: true,
        lineStyle: {
          width: 2,
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 4,
          shadowOffsetY: 4,
        },
        data: seriesData1,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: "Altitude (km) vs. temperature (°C)",
        type: "line",
        symbolSize: 4,
        // symbol: 'circle',
        smooth: true,
        lineStyle: {
          width: 2,
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 4,
          shadowOffsetY: 4,
          color: "red",
        },
        itemStyle: {
          color: "red",
        },
        data: seriesData2,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },

      {
        name: "2011",
        type: "bar",
        data: seriesData3,
        // barDirection: 'horizontal',
        // seriesLayoutBy:"column",
        // barWidth: 10,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
    ],
  };

  chart.setOption(option);
}

const levels = [
  100,
  125,
  150,
  175,
  200,
  225,
  250,
  275,
  300,
  350,
  400,
  450,
  500,
  550,
  600,
  650,
  700,
  750,
  800,
  850,
  900,
  925,
  950,
  975,
  1000,
];
const temperatures1 = [
  -74.7,
  -69.52,
  -65.09,
  -60.56,
  -55.61,
  -49.82,
  -43.1,
  -36.95,
  -32.14,
  -23.78,
  -18.14,
  -13.73,
  -8.76,
  -4.61,
  -1.25,
  1.31,
  4.53,
  6.5,
  8.45,
  9.46,
  9.64,
  9.04,
  9.61,
  10.81,
  12.55,
];
const temperatures2 = [
  -83.65,
  -77.75,
  -74.82,
  -66.22,
  -58.58,
  -52.67,
  -45.73,
  -40.82,
  -34.11,
  -24.59,
  -18.65,
  -14.17,
  -8.77,
  -5.46,
  -1.86,
  0.89,
  4.34,
  6.01,
  7.14,
  6.79,
  7.34,
  7.59,
  7.69,
  8.53,
  9.69,
];
const windSpeedData = [
  42.8,
  42.7,
  42.6,
  42.5,
  42.3,
  41.8,
  40.9,
  39.5,
  37.8,
  35.6,
  33.2,
  30.7,
  28.1,
  25.4,
  22.8,
  20.1,
  17.5,
  15.6,
  13.8,
  12.1,
  10.5,
  9.2,
  7.8,
  6.4,
  5.1,
];

const seriesData1 = [];
for (let i = 0; i < levels.length; i++) {
  seriesData1.push([temperatures1[i], levels[i]]);
}

const seriesData2 = [];
for (let i = 0; i < levels.length; i++) {
  seriesData2.push([temperatures2[i], levels[i]]);
}

const seriesData3 = [];
for (let i = 0; i < levels.length; i++) {
  seriesData3.push([windSpeedData[i], levels[i]]);
  // seriesData3.push([ levels[i],windSpeedData[i]]);
}
onMounted(() => {
  chart = echarts.init(document.querySelector(".vertical_profile"));

  // console.log("seriesData3", seriesData3);
  console.log("windSpeedData", windSpeedData);
  // render(seriesData1, seriesData2, seriesData3, levels);
  render(seriesData1, seriesData2, windSpeedData, levels);
});
</script>
<template>
  <div class="vertical_profile"></div>
</template>
<style>
.vertical_profile {
  /* Add your styles here */
  width: 710px;
  height: 668px;
  /* width: 1000px;
  height: 700px; */
  margin: 30px auto 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
