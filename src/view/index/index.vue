<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted} from "vue";
import * as THREE from "three";
import colorHol from '../../assets/textures/minecraft.png'
import scene from "@/view/index/sceneFunction";
import camera from "@/view/index/cameraFunction";
import renderer from "@/view/index/rendererFunction";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let threejs = ref()

// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
// import { color } from "dat.gui";


// const renderer = new THREE.WebGLRenderer();
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
const clock = new THREE.Clock();

function createThree () {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  camera.position.set(0, 0, 10)
  const axesHelper = new THREE.AxesHelper(5);

// scene.add(cube)
// cube.rotation.set(Math.PI / 4, 0, 0, "XZY");


  const textureLoader = new THREE.TextureLoader();
  const doorColorTexture = textureLoader.load(colorHol);
  doorColorTexture.center.set(0.5,0.5)
// doorColorTexture.rotation = Math.PI / 4
// 添加物体
  const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
// 材质
  const basicMaterial = new THREE.MeshBasicMaterial({
    color: "#ffff00",
    map: doorColorTexture,
  });
  const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
  scene.add(cube);

// doorColorTexture.minFilter = THREE.NearestFilter;
  doorColorTexture.magFilter = THREE.NearestMipMapNearestFilter;

  scene.add(axesHelper);
  scene.add(camera)
}


const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
// scene.add(light);
//直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
let lightFzhu = new THREE.DirectionalLightHelper(directionalLight,2)
scene.add(lightFzhu)
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
// 设置阴影贴图模糊度
directionalLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
directionalLight.shadow.mapSize.set(4096, 4096);
// console.log(directionalLight.shadow);

// 设置平行光投射相机的属性
/*directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = 5;
directionalLight.shadow.camera.left = 5;
directionalLight.shadow.camera.right = 5;*/

scene.add(directionalLight);

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;
scene.add(sphere);
const gui = new dat.GUI();
// // 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
scene.add(plane);
gui
    .add(directionalLight.shadow.camera, "near")
    .min(0)
    .max(10)
    .step(0.1)
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix();
    });




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
