<template>
  <div class="wrap">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted,onUnmounted} from "vue";
import * as THREE from "three";
import scene from "@/tool/sceneFunction";
import camera from "@/tool/cameraFunction";
import renderer from "@/tool/rendererFunction";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import Fireworks from "@/view/fireworks/Fireworks";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gltfModel from '@/assets/model/newyears_min.glb'
let threejs = ref()

// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
const textureLoader = new THREE.TextureLoader()
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
const clock = new THREE.Clock();
const gltfLoader = new GLTFLoader();
let LightBox = null;
let createThree = () => {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMa
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.1;
  camera.position.set(0, 0, 2);
  scene.add(camera)
  //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(0, 30, 0); //default; light shining from top
  light.castShadow = true; // default false
  scene.add(light);
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper)
  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default
  createdMesh()
}
let fireworkList = [];
let createdMesh = () => {
  // scene.add(new THREE.Light(0xffffff,100))

  const rgbeLoader = new RGBELoader();
  rgbeLoader.loadAsync('2k.hdr').then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
  gltfLoader.load(gltfModel, (gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);

    //   创建水面
    const waterGeometry = new THREE.PlaneBufferGeometry(100, 100);
    /*let water = new Water(waterGeometry, {
      scale: 4,
      textureHeight: 1024,
      textureWidth: 1024,
    });
    water.position.y = 1;
    water.rotation.x = -Math.PI / 2;
    scene.add(water);*/
  });
}

let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
  let position = {
    x: (Math.random() - 0.5) * 40,
    z: -(Math.random() - 0.5) * 40,
    y: 3 + Math.random() * 15,
  };
  let fireworks = new Fireworks(color, position)
  fireworks.addScene(scene,camera)
  fireworkList.push(fireworks);
}
 window.addEventListener('click', createFireworks)





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
//controls, renderer,scene,camera
function render() {
  let time = clock.getElapsedTime();
  fireworkList.forEach((item, i) => {
    const type = item.update();
    if (type == "remove") {
      fireworkList.splice(i, 1);
    }
  });
  controls.update();
  renderer.render(scene,camera)

  requestAnimationFrame(render)
}
onMounted(() => {
  createThree()
  threejs.value.appendChild(renderer.domElement)
  renderer.render(scene, camera)
  // render(controls, renderer,scene,camera)
  render()
})

onUnmounted(() => {
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
