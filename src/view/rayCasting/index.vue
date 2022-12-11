<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {ref, onMounted, onUnmounted} from "vue";
import * as THREE from "three";
import colorHol from '../../assets/textures/minecraft.png'
import particles from '../../assets/textures/particles/1.png'
import scene from "@/tool/sceneFunction";
import camera from "@/tool/cameraFunction";
import renderer from "@/tool/rendererFunction";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load(particles);

let threejs = ref()
const gui = new dat.GUI();
let cubeArr = [];
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster(); // 创建投射光线对象
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
  mouseFunction()
}


const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});
let mouseFunction = () => {
  const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
  });
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      for (let z = -5; z < 5; z++) {
        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(i, j, z);
        scene.add(cube);
        cubeArr.push(cube);
      }
    }
  }
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

  threejs.value.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    let result = raycaster.intersectObjects(cubeArr);
    console.log(result);
    /*result.forEach((item) => {
      item.object.material = redMaterial;
    });*/

    if (result.length > 0) {
      result[0].object.material = redMaterial;
    } else {
      console.log(scene)
      for (let i = 0 ; i<scene.children.length;i++) {
        if (scene.children[i].isMesh && scene.children[i]?.material){
          console.log(scene.children[i].object)
          scene.children[i].material = new THREE.MeshBasicMaterial({
            wireframe: true,
          });
        }

      }
    }
  })
})

onUnmounted(() => {

  scene.clear()
  // controls = null
  window.addEventListener("resize", () => {});
  threejs.value = null
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
