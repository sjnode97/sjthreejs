<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted,onUnmounted} from "vue";
import * as THREE from "three";
import colorHol from '../../assets/textures/minecraft.png'
import scene from "@/tool/sceneFunction";
import camera from "@/tool/cameraFunction";
import renderer from "@/tool/rendererFunction";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let threejs = ref()

// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
let gui = new dat.GUI();
let guiposition
let guiangle
let guidistance
let guiX
let guiY
let guipenumbra
let guidecay


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
  createScene()
}
let createScene = () => {

//Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.SpotLight( 0xffffff, 1 );
  light.position.set( 0, 30, 0 ); //default; light shining from top
  light.castShadow = true; // default false
  scene.add( light );

//Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

//Create a sphere that cast shadows (but does not receive them)
  const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
  const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
  const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.position.set(0,7,0)
  sphere.castShadow = true; //default is false
  sphere.receiveShadow = false; //default
  scene.add( sphere );

//Create a plane that receives shadows (but does not cast them)
  const planeGeometry = new THREE.PlaneGeometry( 200, 200, 32, 32 );
  const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } )
  const plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.receiveShadow = true;
  plane.position.set(0, -1, 0);
  plane.rotation.x = -Math.PI / 2;
  scene.add( plane );

//Create a helper for the shadow camera (optional)
  const helper = new THREE.DirectionalLightHelper( light, 0xffffff );
  scene.add( helper );
  console.log(light)

  const light1 = new THREE.PointLight( 0xffffff, 1, 20 );
  light1.position.set( 50, 50, 50 );
  scene.add( light1 );

  guiposition = gui.add(sphere.position, "x").min(-5).max(5).step(0.1);
  guiangle = gui
      .add(light, "angle")
      .min(0)
      .max(Math.PI / 2)
      .step(0.01);
  guidistance = gui.add(light, "distance").min(0).max(10).step(0.01);
  guiX = gui.add(light.position, "x").min(-10).max(10).step(0.01);
  guiY = gui.add(light.position, "y").min(-10).max(100).step(1);
  guipenumbra = gui.add(light, "penumbra").min(0).max(1).step(0.01);
  guidecay = gui.add(light, "decay").min(0).max(5).step(0.01);
}
/*
gui
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);
gui.add(spotLight, "distance").min(0).max(10).step(0.01);
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
gui.add(spotLight, "decay").min(0).max(5).step(0.01);
*/




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

onUnmounted(() => {
  gui.remove(guiposition)
  gui.remove(guiangle)
  gui.remove(guidistance)
  gui.remove(guiX)
  gui.remove(guiY)
  gui.remove(guipenumbra)
  gui.remove(guidecay)
  gui = null
  scene.clear()

  // controls = null
  threejs.value = ''
  window.addEventListener("resize", () => {});
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
