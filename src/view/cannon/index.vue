<template>
  <div className="hello">
    <div ref="threejs"/>
  </div>
</template>

<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import * as THREE from "three";
// import colorHol from '../../assets/textures/minecraft.png'
import scene from "@/tool/sceneFunction";
import camera from "@/tool/cameraFunction";
import renderer from "@/tool/rendererFunction";
import audioPing from "@/assets/audio/metalHit.mp3"
import * as CANNON from "cannon-es"
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "dat.gui";
// let gui = new dat.GUI();

let threejs = ref()

let world = new CANNON.World()
world.gravity.set(0, -9.8, 0);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
const clock = new THREE.Clock();
const hitSound = new Audio(audioPing);
let cubeArr = []
function createThree () {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  camera.position.set(0, 30, 50)
  scene.add(camera)
  initScene()
  window.addEventListener('click' , createCube)
  window.addEventListener('touchend' , createCube)
}
function HitEvent(e) {
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 2) {
    //   重新从零开始播放
    hitSound.currentTime = 0;
    hitSound.volume = impactStrength / 15;
    hitSound.play();
  }
}

let defaultContactMaterial
let initFloor = () => {
      let floorShape = new CANNON.Plane();
      let floorBody = new CANNON.Body()

      floorBody.mass = 0
      // 物理世界创建地面
      const floorMaterial = new CANNON.Material("floor");
      floorBody.material = floorMaterial;
      // 当质量为0的时候，可以使得物体保持不动
      // 地面位置
      floorBody.addShape(floorShape)

      floorBody.position.set(0, -5, 0);
      // 旋转地面的位置
      floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      world.addBody(floorBody)

  // 设置2种材质碰撞的参数
  const cubeWorldMaterial = new CANNON.Material("cube");

  /*cubeBody.applyLocalForce(
      new CANNON.Vec3(300, 0, 0), //添加的力的大小和方向
      new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
  );*/

  defaultContactMaterial = new CANNON.ContactMaterial(
      cubeWorldMaterial,
      floorMaterial,
      {
        //   摩擦力
        friction: 0.1,
        // 弹性
        restitution: 0.5,
      }
  );
  world.addContactMaterial(defaultContactMaterial);

// 设置世界碰撞的默认材料，如果材料没有设置，都用这个
  world.defaultContactMaterial = defaultContactMaterial;
}
let createCube = () => {
  let cubeGeometry = new THREE.BoxGeometry(1,1,1)
  let cubeMesh = new THREE.MeshStandardMaterial()
  let cube = new THREE.Mesh(cubeGeometry, cubeMesh)
  scene.add(cube)
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const cubeWorldMaterial = new CANNON.Material("cube");
  let cubeBody1 = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    //   小球质量
    mass: 1,
    //   物体材质
    material: cubeWorldMaterial,
  });
  cubeBody1.addEventListener("collide", HitEvent);
  cubeBody1.applyLocalForce(
      new CANNON.Vec3(0,0,300),
      new CANNON.Vec3(0,0,0)
  )
  world.addBody(cubeBody1)
  cubeArr.push({
    mesh: cube,
    body: cubeBody1
  })
}
let initScene = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.castShadow = true;
  scene.add(dirLight); //

  const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(20, 20),
      new THREE.MeshStandardMaterial()
  );

  floor.position.set(0, -5, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  initFloor()
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
  world.step(1/60, time)
  //   let deltaTime = clock.getDelta();
  //     console.log("两次获取时间的间隔时间：", deltaTime);
  // cube.position.copy(cubeBody.position)
  cubeArr.forEach(item => {
    if (item.mesh.position) {
      item.mesh.position.copy(item.body.position)
      item.mesh.quaternion.copy(item.body.quaternion)
    }
  })
  controls.update();
  renderer.render(scene,camera)
  requestAnimationFrame(() => {
    render(controls,renderer,scene,camera)
  })
}
onMounted(() => {
  createThree()
  console.log(scene)
  threejs.value.appendChild(renderer.domElement)
  renderer.render(scene, camera)
  render(controls, renderer,scene,camera)
})

onUnmounted(() => {
  scene.clear()

  // controls = null
  threejs.value = ''
  window.addEventListener("resize", () => {});
  window.removeEventListener('click' , createCube)
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
