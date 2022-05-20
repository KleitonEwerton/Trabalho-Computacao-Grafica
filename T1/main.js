import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { Vector3 } from "../build/three.module.js";
import KeyboardState from "../libs/util/KeyboardState.js";

import {
  initRenderer,
  onWindowResize,
  createGroundPlaneWired,
  initDefaultBasicLight,
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
  moveSpeedAirplane, 
  maxDistanceShot,
  camCreat;

//----------------------------- CONFIGS ---------------------------------//
planeSize = 300; //Tamanho do plano
speed = 0.1;
moveSpeedAirplane = 0.4;
maxDistanceShot = 150;
camCreat = true;

let tempo = -40;
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer

scene.add(new THREE.HemisphereLight()); //Luz

configCamera();

createPlanes();

aviao = new Airplane(0.5, 2, 0, 5, -20, false);
scene.add(aviao.cube);

initDefaultBasicLight(scene); // Luz

let shotsList = [];
let enemyList = [];


//Configurações de controle do plano
limiterPlane = -planeSize;
controlsPlane = 0;

var helper = new THREE.BoxHelper(aviao.cube);
helper.update();

render();

function keyboardCamera() {
  keyboard.update();

  if (keyboard.pressed("up")) aviao.moveInZ(-moveSpeedAirplane, 0.005);
  if (keyboard.pressed("down")) aviao.moveInZ(moveSpeedAirplane, 0.005);
  if (keyboard.pressed("left")) aviao.moveInX(-moveSpeedAirplane, 2*0.005);
  if (keyboard.pressed("right")) aviao.moveInX(moveSpeedAirplane, 2*0.005);
  if (keyboard.down("space")) aviao.shot(scene, shotsList);
  if (keyboard.down("ctrl")) aviao.shot(scene, shotsList);

}

function runAnimations() {
  updateShot(2 * speed);
  cameraHolder.translateZ(-speed);
  aviao.moveInZ(-speed, 1); //Atualzia a posição do aviao
  renderInfinityPlane();
  helper.update();// !IMPORTANT ATUALIZA O BOX
}

function render() {

  airplanesCollisions()
  runAnimations();
  keyboardCamera();
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
  gerEnemy();
  removeAirplaneOutPlane();
  

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

    
    let distance = aviao.getVectorPosition().distanceTo(shotsList[i].getVectorPosition());

    for(var j=0; j<enemyList.length; j++) {

      if(detectCollisionCubes(shotsList[i].tiro(), enemyList[j].cube) ){ //! collision ou distancia muito longa

        removeFromScene(shotsList[i].tiro());
        shotsList.splice(i,1);
        removeFromScene(enemyList[j].cube);
        enemyList.splice(j, 1);
        break;
      }

    }
    if(distance > maxDistanceShot){

      removeFromScene(shotsList[i].tiro());
      shotsList.splice(i,1);

    }

    

  }
}

function airplanesCollisions(){

  //TODO: passar por toda lista de aviões
  //TODO: Animação de colisão
  for(var i = 0;i< enemyList.length; i++)
    if(detectCollisionCubes(aviao.cube, enemyList[i].cube)){
    removeFromScene(enemyList[i].cube);
    enemyList.splice(i,1);
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
  
  let box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);

  let box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);
 
  return box1.intersectsBox(box2);
}

function gerEnemy(){

  if(enemyList.length <5 && camCreat){
    
    enemyList.push(new Airplane(0.5, 2, -40 + Math.floor(Math.random() * 81), 5, tempo, true));
    tempo -= 10;
 
  }
  for(var i = 0; i < enemyList.length; i++)
    scene.add(enemyList[i].cube);
}

function removeAirplaneOutPlane(){

  for(var i = 0; i < enemyList.length;i++){
  
  
    
   }

}