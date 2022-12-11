<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted} from "vue";
import * as THREE from "three";
import particles from '../../assets/textures/particles/2.png'
import scene from "@/tool/sceneFunction";
import camera from "@/tool/cameraFunction";
import renderer from "@/tool/rendererFunction";
import one from '../../assets/textures/particles/1.png'
import two from '../../assets/textures/particles/4.png'
import three from '../../assets/textures/particles/3.png'
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load(particles);

let threejs = ref()
const gui = new dat.GUI();

// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
const clock = new THREE.Clock();



// 创建球几何体
const sphereGeometry = new THREE.SphereBufferGeometry(3, 30, 30);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(sphereGeometry, material);
scene.add(mesh);

// 设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.1;
pointsMaterial.color.set(0xfff000);
// 相机深度而衰减
// pointsMaterial.sizeAttenuation = true;

// 载入纹理
const texture = textureLoader.load(particles);
// 设置点材质纹理
pointsMaterial.map = texture;
pointsMaterial.alphaMap = texture;
pointsMaterial.transparent = true;
pointsMaterial.depthWrite = false;
pointsMaterial.blending = THREE.AdditiveBlending;

const points1 = new THREE.Points(sphereGeometry, pointsMaterial);
scene.add(points1);

function createPoints(url, size = 0.5) {
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 10000;

  // 设置缓冲区数组
  const positions = new Float32Array(count * 3);
  // 设置粒子顶点颜色
  const colors = new Float32Array(count * 3);
  // 设置顶点
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
    colors[i] = '#ffffff';
  }
  particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 设置点材质
  const pointsMaterial = new THREE.PointsMaterial();
  pointsMaterial.size = 0.5;
  pointsMaterial.color.set(0xfff000);
  // 相机深度而衰减
  pointsMaterial.sizeAttenuation = true;

  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(url);
  // 设置点材质纹理
  pointsMaterial.map = texture;
  pointsMaterial.alphaMap = texture;
  pointsMaterial.transparent = true;
  pointsMaterial.depthWrite = false;
  pointsMaterial.blending = THREE.AdditiveBlending;
  // 设置启动顶点颜色
  pointsMaterial.vertexColors = true;

  const points = new THREE.Points(particlesGeometry, pointsMaterial);

  scene.add(points);
  return points;
}
const points = createPoints(one, 1.5);
const points2 = createPoints(two, 1);
const points3 = createPoints(three, 2);

function createThree () {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMa
  camera.position.set(0, 30, 5)
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
  points.rotation.x = time * 0.3;
  points2.rotation.x = time * 0.5;
  points2.rotation.y = time * 0.4;
  points3.rotation.x = time * 0.2;
  points3.rotation.y = time * 0.2;
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
