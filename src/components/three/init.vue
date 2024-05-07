<script setup>
import { onMounted, nextTick, ref, setTransitionHooks } from "vue";
import * as THREE from "three";
// 场景 Scene
// 相机 Camera
// 渲染器 Renderer

const firstThreeJS = ref();

class FirstDemo {
  width;
  height;

  renderer;
  camera;
  scene;

  testY;

  constructor(params) {
    this.testY = 200;

    this.width = params.width;
    this.height = params.height;
    this.init();
  }
  init() {
    // demo from https://www.three3d.cn/docs/index.html#manual/zh/introduction/Drawing-lines
    this.renderer = new THREE.WebGLRenderer({ canvas: firstThreeJS.value });

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 500);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
  }
  render(containerWidth, containerHeight) {
    // this.drawLine();
    this.draw3DBox(containerWidth, containerHeight);
  }
  clear() {
    this.renderer.clear();
  }
  changeCamera(x, y, z, containerWidth, containerHeight) {
    this.camera = new THREE.PerspectiveCamera(
      30, // 摄像机视锥体垂直视野角度
      containerWidth / containerHeight, // 摄像机视锥体长宽比
      1, // 摄像机视锥体近端面
      3000 // 摄像机视锥体远端面
    );
    this.renderer.setSize(containerWidth, containerHeight);

    if (containerWidth > this.width) {
      if (this.testY >= 360) {
        this.testY = 360;
      } else {
        this.testY += 10;
      }
    } else {
      if (this.testY <= -360) {
        this.testY = -360;
      } else {
        this.testY -= 10;
      }
    }
    this.camera.position.set(this.testY, this.testY, 200);
    this.camera.lookAt(x, y, z);
    this.width = containerWidth;
    this.height = containerHeight;
  }
  //create a blue LineBasicMaterial
  drawLine() {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);

    this.scene.add(line);
    this.renderer.render(this.scene, this.camera);
  }
  draw3DBox(containerWidth, containerHeight) {
    const _width = containerWidth ? containerWidth : this.width;
    const _height = containerHeight ? containerHeight : this.height;
    // 几何体 长方体
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    // 材质
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    // 网格模型
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);

    // this.changeCamera(mesh.position);
    this.changeCamera(0, 0, 0, _width, _height);

    this.renderer.render(this.scene, this.camera);
  }
}

function listeningToScreenSize(firstDemo) {
  window.addEventListener("resize", function () {
    firstDemo.clear();
    nextTick(() => {
      firstDemo.render(window.innerWidth, window.innerHeight);
    });
  });
}

onMounted(async () => {
  await nextTick();
  firstThreeJS.value.width = window.innerWidth;
  firstThreeJS.value.height = window.innerHeight;

  const firstDemo = new FirstDemo({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  firstDemo.render();

  listeningToScreenSize(firstDemo);

  document.documentElement.onclick = function () {
    console.log("click");
  };
});
</script>
<template>
  <canvas id="first_threejs" ref="firstThreeJS"></canvas>
</template>

<style lang="scss">
#first_threejs {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
