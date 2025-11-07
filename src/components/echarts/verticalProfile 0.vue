<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

var chart = null;

function render(seriesData1, seriesData2) {
  const option = {
    legend: {
      data: ["Altitude (km) vs. temperature (°C)"],
    },
    tooltip: {
      trigger: "axis",
      formatter: "Temperature : <br/>{b}km : {c}°C",
    },
    grid: {
      top: "6%",
      right: "6%",
      bottom: "10%",
      left: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} °C",
      },
      min: -120,
      max: 50,
    },
    yAxis: {
      type: "category",
      axisLine: { onZero: false },
      axisLabel: {
        formatter: "{value} hPa",
      },
      inverse: true,
      boundaryGap: false,
      interval: 100,
    },
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
      },
    ],
  };

  chart.setOption(option);
}

onMounted(() => {
  chart = echarts.init(document.querySelector(".vertical_profile"));

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

  const seriesData1 = [];
  for (let i = 0; i < levels.length; i++) {
    seriesData1.push([temperatures1[i], levels[i]]);
  }

  const seriesData2 = [];
  for (let i = 0; i < levels.length; i++) {
    seriesData2.push([temperatures2[i], levels[i]]);
  }

  render(seriesData1, seriesData2);
});
</script>
<template>
  <div class="vertical_profile"></div>
</template>
<style>
.vertical_profile {
  /* Add your styles here */
  width: 500px;
  height: 500px;
  margin: 30px auto 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
