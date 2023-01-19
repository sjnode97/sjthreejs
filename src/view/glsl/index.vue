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
import basicVertex from './shader/row/vertex.glsl'
import basicFragment from './shader/row/fragment.glsl'
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ca1 from '../../assets/textures/ca.jpeg';

let threejs = ref()

// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
const textureLoader = new THREE.TextureLoader()
let texture = textureLoader.load(ca1)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
const clock = new THREE.Clock();

let createThree = () => {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMa
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
let rawShaderMaterial
let createdMesh = () => {
  /*rawShaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: basicVertex,
    fragmentShader: basicFragment,
    // wireframe: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: {
        value: 0
      },
      uTexture: {
        value: texture
      },
    },
  })*/
  rawShaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: basicVertex,
    fragmentShader: basicFragment,
    // wireframe: true,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: {
        value: new THREE.Color("purple"),
      },
      uTime: {
        value: 0
      },
      uTexture: {
        value: texture
      },
    },
  })
// const material = new THREE.MeshBasicMaterial({color: "#00ff00"})
  let geo =  new THREE.PlaneBufferGeometry(1,1,64,64)
// 创建平面
  const floor = new THREE.Mesh(
      geo,
      rawShaderMaterial
  )
  scene.add(floor);
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
//controls, renderer,scene,camera
function render() {
  let time = clock.getElapsedTime();
  //   let deltaTime = clock.getDelta();
  //     console.log("两次获取时间的间隔时间：", deltaTime);
  controls.update();
  renderer.render(scene,camera)
  rawShaderMaterial.uniforms.uTime.value = time

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
