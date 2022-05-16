import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import KeyboardState from "../libs/util/KeyboardState.js";

import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  initBasicMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneWired,
} from "../libs/util/util.js";

import { Retangulo } from "./aviao.js";

let keyboard = new KeyboardState();

let scene,
  renderer,
  camera,
  cameraHolder,
  plane,
  plane2,
  planeSize,
  limiterPlane,
  controlsPlane,
  aviao;

planeSize = 300; //Tamanho do plano
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer

scene.add(new THREE.HemisphereLight()); //Luz

configCamera();

createPlanes();

aviao = new Retangulo(0.5, 2, 0, 5, -20);
scene.add(aviao.cube);

//Configurações de controle do plano
limiterPlane = -planeSize;
controlsPlane = 0;

render();

function keyboardCamera() {
  keyboard.update();

  const frustum = new THREE.Frustum()
  const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  frustum.setFromProjectionMatrix(matrix)

  if (keyboard.pressed("up") && frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInZ(-0.2, 0.001);
  if (keyboard.pressed("up") && !frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInZ(0.2, 0.001);

  if (keyboard.pressed("down") && frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInZ(0.2, 0.001);
  if (keyboard.pressed("down") && !frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInZ(-0.2, 0.001);

  if (keyboard.pressed("left") && frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInX(-0.2, 0.001);
  if (keyboard.pressed("left") && !frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInX(0.2, 0.001);

  if (keyboard.pressed("right") && frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInX(0.2, 0.001);
  if (keyboard.pressed("right") && !frustum.containsPoint(aviao.getVectorPosition())) aviao.moveInX(-0.2, 0.001);
}

function runAnimations() {
  cameraHolder.translateZ(-0.4);
  console.log(cameraHolder.position, aviao.getVectorPosition());

  aviao.moveInZ(-0.4, 1);
  renderInfinityPlane();
}

function render() {
  runAnimations();
  keyboardCamera();
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}

// Renderiza o plano infinitamente
function renderInfinityPlane() {
  if (cameraHolder.position.z < limiterPlane) {
    limiterPlane += -planeSize;

    if (controlsPlane % 2 == 0) plane.position.z = limiterPlane;
    else plane2.position.z = limiterPlane;

    controlsPlane += 1;
  }
}

function configCamera() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 1);
  camera.up.set(0, 0, 0);
  camera.lookAt(0, 0, 0);
  camera.rotateX(-1.6);
  scene.add(camera);

  window.addEventListener(
    "resize",
    function () {
      onWindowResize(camera, renderer);
    },
    false
  );

  //camera position
  cameraHolder = new THREE.Object3D();

  cameraHolder.add(camera);

  cameraHolder.position.set(0, 20, 0);

  scene.add(cameraHolder);
}

function createPlanes() {
  // create the ground plane
  plane = createGroundPlaneWired(planeSize, planeSize, 50, 50);
  plane2 = createGroundPlaneWired(planeSize, planeSize, 50, 50);

  scene.add(plane);
  scene.add(plane2);

  plane.position.z = 0;
  plane2.position.z = -planeSize;
}
