import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import KeyboardState from "../libs/util/KeyboardState.js";

import {
  initRenderer,
  onWindowResize,
  createGroundPlaneWired,
} from "../libs/util/util.js";

import { Airplane } from "./aviao.js";

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
  aviao,
  speed,
  moveSpeedAirplane;

//----------------------------- CONFIGS ---------------------------------//
planeSize = 300; //Tamanho do plano
speed = 0.1;
moveSpeedAirplane = 0.4;

scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer

scene.add(new THREE.HemisphereLight()); //Luz

configCamera();

createPlanes();

aviao = new Airplane(0.5, 2, 0, 5, -20, false);
scene.add(aviao.cube);

let aviao2 = new Airplane(0.5, 2, 0, 5, -40, false);
scene.add(aviao2.cube);
let shotsList = [];
let enemyList = [];


//Configurações de controle do plano
limiterPlane = -planeSize;
controlsPlane = 0;

var helper = new THREE.BoundingBoxHelper(aviao.cube, 0xff0000);
helper.update();
// If you want a visible bounding box
scene.add(helper);
// If you just want the numbers
 //console.log(helper.box.max);
// console.log(helper.box.max);

render();

function keyboardCamera() {
  keyboard.update();

  if (keyboard.pressed("up")) aviao.moveInZ(-moveSpeedAirplane, 0.005);
  if (keyboard.pressed("down")) aviao.moveInZ(moveSpeedAirplane, 0.005);
  if (keyboard.pressed("left")) aviao.moveInX(-moveSpeedAirplane, 2*0.005);
  if (keyboard.pressed("right")) aviao.moveInX(moveSpeedAirplane, 2*0.005);
  if (keyboard.down("space")) aviao.shot(scene, shotsList);
}

function runAnimations() {
  updateShot(2 * speed);
  cameraHolder.translateZ(-speed);
  aviao.moveInZ(-speed, 1); //Atualzia a posição do aviao
  renderInfinityPlane();

  

  helper.update();// !IMPORTANT ATUALIZA O BOX
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
  camera.rotateX(-1.7);
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

function updateShot(speed) {
  for (var i = 0; i < shotsList.length; i++) {
    shotsList[i].moveInZ(-speed * 10, 0.1);

    if(detectCollisionCubes(shotsList[i].tiro(), aviao2.cube)){ //! collision ou distancia muito longa


      removeFromScene(shotsList[i].tiro())
      shotsList.splice(i,1);
    }

  }
}
function removeFromScene(obj){
  scene.remove(obj);
}
function detectCollisionCubes(object1, object2){
  object1.geometry.computeBoundingBox(); //not needed if its already calculated
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();
  
  var box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);

  var box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);
  // console.log(box1.intersectsBox(box2));
  return box1.intersectsBox(box2);
}
