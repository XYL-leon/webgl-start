<script setup>
import { onMounted, nextTick, ref } from "vue";
import * as THREE from "three";
// 场景 Scene
// 相机 Camera
// 渲染器 Renderer

const firstThreeJS = ref();

class FirstDemo {
  constructor() {}
  render() {
    // demo from https://www.three3d.cn/docs/index.html#manual/zh/introduction/Drawing-lines
    const renderer = new THREE.WebGLRenderer({ canvas: firstThreeJS.value });

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);
  }
}

onMounted(async () => {
  await nextTick();
  const firstDemo = new FirstDemo();
  firstDemo.render();
});
</script>
<template>
  <canvas id="first_threejs" ref="firstThreeJS" width="500" height="500"></canvas>
</template>

<style lang="scss">
#first_threejs {
  width: 500px;
  height: 500px;
}
</style>
