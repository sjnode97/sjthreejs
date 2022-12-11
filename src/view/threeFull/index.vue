<template>
  <div class="page page0">
    <h1>打码-Ray投射光线</h1>
    <h3>THREE.Raycaster实现3d交互效果</h3>
  </div>
  <div class="page page1">
    <h1>THREE.BufferGeometry！</h1>
    <h3>应用打造酷炫的三角形</h3>
  </div>
  <div class="page page2">
    <h1>活泼点光源</h1>
    <h3>点光源围绕照亮小球</h3>
  </div>
</template>

<script setup>

import {ref, onMounted, onUnmounted} from "vue";
import * as THREE from "three";
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
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
const controls = null
// controls.enableDamping = true;
const clock = new THREE.Clock();

function createThree () {
// 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMa
  camera.position.set(0, 0, 18);
  scene.add(camera)
  initContent()
}

let arrGroup

let initContent = () => {
  // 立方体
  const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
  });
  const redMaterial = new THREE.MeshBasicMaterial({
    color: "#ff0000",
  });
  let cubeArr = [];
  let cubeGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let z = 0; z < 5; z++) {
        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4);
        cubeGroup.add(cube);
        cubeArr.push(cube);
      }
    }
  }

  scene.add(cubeGroup);


  // 三角形
  var sjxGroup = new THREE.Group();
  for (let i = 0; i < 50; i++) {
    // 每一个三角形，需要3个顶点，每个顶点需要3个值
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
      if (j % 3 === 1) {
        positionArray[j] = Math.random() * 10 - 5;
      } else {
        positionArray[j] = Math.random() * 10 - 5;
      }
    }
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positionArray, 3)
    );
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    // 根据几何体和材质创建物体
    let sjxMesh = new THREE.Mesh(geometry, material);
    //   console.log(mesh);
    sjxGroup.add(sjxMesh);
  }
  sjxGroup.position.set(0, -30, 0);
  scene.add(sjxGroup);


  // 弹跳小球
  const sphereGroup = new THREE.Group();
  const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
  const spherematerial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  });
  const sphere = new THREE.Mesh(sphereGeometry, spherematerial);
// 投射阴影
  sphere.castShadow = true;

  sphereGroup.add(sphere);

  // // 创建平面
  const planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
  const plane = new THREE.Mesh(planeGeometry, spherematerial);
  plane.position.set(0, -1, 0);
  plane.rotation.x = -Math.PI / 2;
// 接收阴影
  plane.receiveShadow = true;
  sphereGroup.add(plane);



// 灯光
// 环境光
  const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  sphereGroup.add(light);

  const smallBall = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  smallBall.position.set(2, 2, 2);

  //直线光源
  const pointLight = new THREE.PointLight(0xff0000, 3);
// pointLight.position.set(2, 2, 2);
  pointLight.castShadow = true;

// 设置阴影贴图模糊度
  pointLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
  pointLight.shadow.mapSize.set(512, 512);


  // 设置透视相机的属性
  smallBall.add(pointLight);
  sphereGroup.add(smallBall);

  sphereGroup.position.set(0, -60, 0);
  scene.add(sphereGroup);

  arrGroup = [cubeGroup, sjxGroup, sphereGroup];

// 创建投射光线对象
  const raycaster = new THREE.Raycaster();

// 鼠标的位置对象
  const mouse = new THREE.Vector2();

  // 监听鼠标的位置
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
  });

  // 监听鼠标的位置
  window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    let result = raycaster.intersectObjects(cubeArr);
    //   console.log(result);
    if (result[0]) {
      result[0].object.material = redMaterial;

    }
    /*result.forEach((item) => {
      item.object.material = redMaterial;
    });*/
  });

  gsap.to(cubeGroup.rotation, {
    x: "+=" + Math.PI * 2,
    y: "+=" + Math.PI * 2,
    duration: 10,
    ease: "power2.inOut",
    repeat: -1,
  });
  gsap.to(sjxGroup.rotation, {
    x: "-=" + Math.PI * 2,
    z: "+=" + Math.PI * 2,
    duration: 12,
    ease: "power2.inOut",
    repeat: -1,
  });
  gsap.to(smallBall.position, {
    x: -3,
    duration: 6,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });
  gsap.to(smallBall.position, {
    y: 0,
    duration: 0.5,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });

  // 监听滚动事件

}
let currentPage = 0;



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
  //   根据当前滚动的scrolly，去设置相机移动的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 30;

  camera.position.x += (mouse.x * 10 - camera.position.x) * time * 5;
  // controls.update();
  renderer.render(scene,camera)
  requestAnimationFrame(() => {
    render(controls,renderer,scene,camera)
  })
}
onMounted(() => {
  createThree()
  renderer.domElement.style.position = 'fixed'
  renderer.domElement.style.left = 0
  renderer.domElement.style.top = 0
  document.body.appendChild(renderer.domElement)
  renderer.render(scene, camera)
  render(controls, renderer,scene,camera)
  window.addEventListener("scroll", () => {
    console.log(window.scrollY,);
    const newPage = Math.round(window.scrollY / window.innerHeight);
    if (newPage !== currentPage) {
      currentPage = newPage;
      console.log("改变页面，当前是：" + currentPage);
      // console.log(arrGroup[currentPage].rotation);
      gsap.to(arrGroup[currentPage].rotation, {
        z: "+=" + Math.PI * 2,
        x: "+=" + Math.PI * 2,
        duration: 2,
        onComplete: () => {
          console.log("旋转完成");
        },
      });

      /*gsap.to(`.page${currentPage} h1`, {
        rotate: "+=360",
        duration: 1,
      });*/
      /*gsap.fromTo(
          `.page${currentPage} h1`,
          { x: -300 },
          { x: 0, rotate: "+=360", duration: 1 }
      );*/
    }
  });

})
onUnmounted(() => {

  scene.clear()
  // controls = null
  window.addEventListener("resize", () => {});
  // threejs.value = null
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: rgb(36, 58, 66);
}
canvas {
  position: fixed;
  left: 0;
  top: 0;
}
.page {
  height: 100vh;
  display: flex;
  color: #fff;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: relative;
  z-index: 10;
}
.page h1 {
  margin: 60px;
  font-size: 40px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
