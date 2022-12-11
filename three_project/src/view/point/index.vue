<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted} from "vue";
import * as THREE from "three";
import colorHol from '../../assets/textures/minecraft.png'
import scene from "@/tool/sceneFunction";
import camera from "@/tool/cameraFunction";
import renderer from "@/tool/rendererFunction";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let threejs = ref()
const gui = new dat.GUI();

// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
const clock = new THREE.Clock();

function createThree () {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMa
  camera.position.set(0, 30, 100)
  scene.add(camera)
}


window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

function render(controls, renderer,scene,camera) {
  let time = clock.getElapsedTime();
  //   let deltaTime = clock.getDelta();
  //     console.log("两次获取时间的间隔时间：", deltaTime);
  controls.update();
  renderer.render(scene,camera)
  requestAnimationFrame(() => {
    render(controls,renderer,scene,camera)
  })
}
onMounted(() => {
  createThree()
  threejs.value.appendChild(renderer.domElement)
  renderer.render(scene, camera)
  render(controls, renderer,scene,camera)
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
