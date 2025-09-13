import * as THREE from "https://esm.sh/three@0.151.3";

import { OrbitControls } from "https://esm.sh/three@0.151.3/addons/controls/OrbitControls.js";
import { OutlineEffect } from "https://esm.sh/three@0.151.3/addons/effects/OutlineEffect.js";
import { GLTFLoader } from "https://esm.sh/three@0.151.3/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Base camera
const camera = new THREE.PerspectiveCamera(
  10,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.x = 60;
camera.position.y = 35;
camera.position.z = 80;
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;

controls.enablePan = true;
controls.minPolarAngle = Math.PI / 5;
controls.maxPolarAngle = Math.PI / 2;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// Materials
const bakedTexture = textureLoader.load(
  "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room15/9d7db1ccdb3f5af8eae99fe8cb25228459bae93d/dist/baked.jpg"
);
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
  side: THREE.DoubleSide
});

bakedMaterial.userData.outlineParameters = {
  // thickness: 0.0025,
  thickness: 0.0025,
  color: [0, 0, 0],
  alpha: 1,
  keepAlive: true,
  visible: true
};

//Loader
const loader = new GLTFLoader();
loader.load(
  "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room15/9d7db1ccdb3f5af8eae99fe8cb25228459bae93d/dist/model.glb",
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => (child.material = bakedMaterial));
    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }
);

// Animation
const minPan = new THREE.Vector3(-5, -2, -5);

const maxPan = new THREE.Vector3(5, 2, 5);
const effect = new OutlineEffect(renderer);

const tick = () => {
  controls.update();
  controls.target.clamp(minPan, maxPan);
  // renderer.render(scene, camera)
  effect.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
a
