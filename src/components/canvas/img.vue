<script setup>
import { ref, onMounted } from "vue";
let container = ref(null);
let ctx = null;

// RadarLegend 组合反射率 来自天擎实况 http://idata.cma/art/#/home/default
const RadarLegend = {
  colors: [
    // [10, "rgb(0, 161, 247)"],
    // [15, "rgb(0, 236, 236)"],
    // [20, "rgb(0, 216, 24)"],
    // [25, "rgb(0, 144, 12)"],
    // [30, "rgb(254, 254, 31)"],
    // [35, "rgb(230, 192, 20)"],
    // [40, "rgb(254, 144, 13)"],

    [45, "rgb(254, 3, 2)"],
    [50, "rgb(214, 2, 1)"],
    [55, "rgb(192, 1, 1)"],
    [60, "rgb(255, 16, 239)"],
    // [60, "rgb(234, 65, 233)"],
    [65, "rgb(151, 8, 179)"],
    [70, "rgb(173, 145, 239)"],
  ],
};
const radarImgInfo = {
  width: 4960,
  height: 3360,
};

function draw() {
  let radio = window.devicePixelRatio;
  //   console.log("devicePixelRatio:", radio);
  console.log("origin img info:", radarImgInfo.width, radarImgInfo.height);

  // 创建Image对象
  const img = new Image();

  // 设置图像源（这里使用示例PNG图像）
  img.src = "RADA_ET_20250731111200_4326_H_1000.png"; // 示例PNG图像
  // img.src = "1.jpg"; // 示例PNG图像

  // 图像加载完成后绘制到Canvas
  img.onload = function () {
    const _canvas = document.createElement("canvas");
    _canvas.width = img.width;
    _canvas.height = img.height;
    const _ctx = _canvas.getContext("2d");
    // 绘制整个图像到Canvas（x, y, width, height）
    // _ctx.drawImage(img, 0, 0, img.width, img.height);
    _ctx.drawImage(img, 0, 0, 1240, 840);

    // 获取Canvas的像素数据
    const imageData = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
    const data = imageData.data;

    // let colors = RadarLegend.colors.slice(7, RadarLegend.colors.length - 1);
    let colors = RadarLegend.colors;

    let obj = {};
    // 遍历每个像素并应用过滤
    const threshold = 140;
    const aa = (img.width * img.height) / 2;
    const aaa = img.width / 2;

    console.log(aa, aaa);
    let _arr = [];
    const half = (3360 / 2) * 4960;

    // let img = new Image();
    for (let i = 0; i < data.length; i += 4) {
      // i+1>4960/2
      //   10/2+(2-1)*104960/2+(line-1)*4960
      // console.log(line)
      // if (i > aa && i) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3]; // 透明度

        // const line = Math.ceil((i + 1) / 4960);
        // var halfi = 4960 / 2 + (line - 1) * 4960;
        // if (i < half && i < halfi) {
        //   _arr.push(r);
        //   _arr.push(g);
        //   _arr.push(b);
        //   _arr.push(a);
        // }

        // let index = colors.findIndex((item) => {
        //   let arr = item[1].split("(")[1].split(")")[0].split(",");
        //   let a = 0;
        //   arr.map((el) => (a += +el));
        //   return red + green + blue === a;
        //   // return green === 251;
        //   // return red === +arr[0].trim();
        //   // return green === +arr[1].trim();
        //   // return blue === +arr[2].trim();
        //   return (
        //     red === +arr[0].trim() && green === +arr[1].trim() && blue === +arr[2].trim()
        //   );
        // });

        let key = String([r, g, b]);
        if (!obj[key]) {
          obj[key] = key;
        }

        if (isGreenish(r, g, b, threshold)) {
          data[i] = 0; // 红色通道
          data[i + 1] = 0; // 绿色通道
          data[i + 2] = 0; // 蓝色通道
          data[i + 3] = 0; // 蓝色通道
        }
      // }
    }
    // imageData.data = _arr;
    console.log(obj);
    console.log("处理后的数据:", imageData);
    // 将处理后的像素数据放回Canvas
    ctx.putImageData(imageData, 0, 0);
  };
}

// 判断是否为绿色系
function isGreenish(r, g, b, threshold) {
  // 绿色系：绿色值明显高于红色和蓝色，且绿色值足够高
  return g > r && g > b && g > threshold;
}

// 判断是否为蓝色系
function isBlueish(r, g, b, threshold) {
  // 蓝色系：蓝色值明显高于红色和绿色，且蓝色值足够高
  return b > r && b > g && b > threshold;
}

onMounted(() => {
  if (container.value.getContext) {
    // 获取渲染上下文和绘制功能;
    ctx = container.value.getContext("2d");
    // console.log(ctx);
    draw();
  } else {
    console.log("您的浏览器不支持canvas");
  }
});
</script>
<template>
  <canvas id="tutorial" ref="container" width="1240" height="840"> </canvas>
</template>
<style scoped>
#tutorial {
  display: block;
  border: 1px solid black;
  width: 1240px;
  height: 840px;
  margin: 2px auto;
  background: #000;
  /* color:rgb(234, 65, 169); */
}
</style>
