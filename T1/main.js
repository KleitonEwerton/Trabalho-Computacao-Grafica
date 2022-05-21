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

let p1, p2, p3;
p1 = new Retangulo(0.5, 2, 0, 5, -50);
scene.add(p1.cube);
p1.moveInZ(-0.4, 1);

//Configurações de controle do plano
limiterPlane = -planeSize;
controlsPlane = 0;

render();

function keyboardCamera() {
  keyboard.update();

  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(matrix);

  let position1 = new THREE.Vector3();
  position1.setFromMatrixPosition(aviao.cube.matrixWorld);
  
  if (keyboard.pressed("up")) {
    position1.z -= 0.2;
    if (frustum.containsPoint(position1)) aviao.moveInZ(-0.2, 0.001);
      //else aviao.moveInZ(0.2, 0.001);
  }
  if (keyboard.pressed("down")) {
    position1.z += 0.2;
    if (frustum.containsPoint(position1)) aviao.moveInZ(0.2, 0.001);
    //else aviao.moveInZ(-0.2, 0.001);
  }
  if (keyboard.pressed("left")) {
    position1.x -= 0.2;
    if (frustum.containsPoint(position1)) aviao.moveInX(-0.2, 0.001);
    //else aviao.moveInX(0.2, 0.001);
  }
  if (keyboard.pressed("right")) {
    position1.x += 0.2;
    if (frustum.containsPoint(position1)) aviao.moveInX(0.2, 0.001);
    //else aviao.moveInX(-0.2, 0.001);
  }
}

function runAnimations() {
  cameraHolder.translateZ(-0.4);
  //console.log(cameraHolder.position, aviao.getVectorPosition());
  //console.log("1: " + plane.position.z);
  //console.log("2 :" + plane2.position.z);
  projeteis();
  aviao.moveInZ(-0.4, 1);
  renderInfinityPlane();
}

function projeteis() {
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(matrix);

  //console.log(matrix.getMaxScaleOnAxis());

  //console.log(p1.getVectorPosition());
  if (!frustum.containsPoint(p1.getVectorPosition())) {

    // console.log("1: " + plane.position.z);
    // console.log("2: " + plane2.position.z);
    //  console.log("3: " + cameraHolder.position.z);
    //  console.log("a: "+aviao.cube.position.z);

    if (plane.position.z < plane2.position.z) {
      //var plano = plane.position.z - 100;
      //console.log(plano);
      // var Z1 = getRandomArbitrary(plane.position.z, aviao.cube.position.z);
      var Z1 = plane.position.z;
      
    }
    else {
      // var Z1 = getRandomArbitrary(plane2.position.z, aviao.cube.position.z);
      var Z1 = plane2.position.z;
    }
    var X1 = getRandomArbitrary(-10, 10);
    //console.log(Z1);

    scene.remove(p1.cube);
    p1 = new Retangulo(0.5, 2, X1, 5, Z1);
    //console.log("OI");
    scene.add(p1.cube);
    p1.moveInZ(-0.8, 1);
  }
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

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
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

  cameraHolder.position.set(0, 15, 0);

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