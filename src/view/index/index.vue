<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted} from "vue";
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
// import * as dat from "dat.gui";
// import { color } from "dat.gui";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);


// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
scene.add(camera)
scene.add(cube)
// cube.rotation.set(Math.PI / 4, 0, 0, "XZY");
const controls = new OrbitControls(camera, renderer.domElement)
let threejs = ref()
const clock = new THREE.Clock();
function render() {
  let time = clock.getElapsedTime();
  //   let deltaTime = clock.getDelta();
  //     console.log("两次获取时间的间隔时间：", deltaTime);
  let t = time % 5;
  cube.position.x = t * 1;
  renderer.render(scene,camera)
  requestAnimationFrame(render)
}
onMounted(() => {
  threejs.value.appendChild(renderer.domElement)
  renderer.render(scene, camera)
  render()
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
