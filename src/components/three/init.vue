<script setup>
import { onMounted } from "vue";
import * as THREE from "three.js";
// 场景 Scene
// 相机 Camera
// 渲染器 Renderer

class FirstDemo {
  constructor() {}
  render() {
    // 创建3D场景对象Scene
    const scene = new THREE.Scene();

    //创建一个长方体几何对象Geometry
    const geometry = new THREE.BoxGeometry(100, 100, 100);

    //创建一个材质对象Material
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000, //0xff0000设置材质颜色为红色
    });

    // 两个参数分别为几何体geometry、材质material
    const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh

    //设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 10, 0);

    scene.add(mesh);
  }
}

onMounted(() => {
  //   const firstDemo = new FirstDemo();
});
</script>
<template>
  <div class="first_demo"></div>
</template>
