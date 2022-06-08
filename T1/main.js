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

import { AirplaneEnemy } from "./airplaneEnemy.js";
import { AirplanePlayer } from "./airplanePlayer.js";

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
  player,
  speed,
  moveSpeedAirplane,
  maxDistanceShot,
  posInitPlayerX,
  posInitPlayerY,
  posInitPlayerZ,
  start;

//----------------------------- CONFIGURAÇÕES BASICAS---------------------------------//
planeSize = 500; //Tamanho do plano
speed = 0.1;
moveSpeedAirplane = 0.4;
maxDistanceShot = 150;
posInitPlayerX = 0;
posInitPlayerY = 5;
posInitPlayerZ = -20;
start = true;
//------------------------------------------------------------------------------------//

scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
initDefaultBasicLight(scene); // Luz
configCamera();

createPlanes();

createPlayer();

scene.add(player.cone);

let shotsList = [];
let enemyList = [];

render();

//----------------------- Controles ----------------------------------
function keyboardCamera() {
  keyboard.update();

  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);

  let position1 = new THREE.Vector3();
  position1.setFromMatrixPosition(player.cone.matrixWorld);

  if (start) {
    if (keyboard.pressed("up")) {
      position1.z -= 2.5;
      if (frustum.containsPoint(position1)) player.moveInZ(-moveSpeedAirplane);
    }
    if (keyboard.pressed("down")) {
      position1.z += 2.5;
      if (frustum.containsPoint(position1)) player.moveInZ(moveSpeedAirplane);
    }
    if (keyboard.pressed("left")) {
      position1.x -= 0.8;
      if (frustum.containsPoint(position1)) player.moveInX(-moveSpeedAirplane);
    }
    if (keyboard.pressed("right")) {
      position1.x += 0.8;
      if (frustum.containsPoint(position1)) player.moveInX(moveSpeedAirplane);
    }
    if (keyboard.down("space")) player.shot(scene, shotsList);

    if (keyboard.down("ctrl")) player.shot(scene, shotsList);
  }
}
//---------------------------------------------------------------------

//------------------------ Remoções ---------------------------

function removeShotsCollisionsAndOutPlane() {
  for (var i = 0; i < shotsList.length; i++) {
    //Calcula a distancia do tiro do player para remover
    let distance = player
      .getVectorPosition()
      .distanceTo(shotsList[i].getVectorPosition());

    for (var j = 0; j < enemyList.length; j++) {
      if (detectCollisionCubes(shotsList[i].tiro(), enemyList[j].cube)) {
        //Se colidir  com o inimigo remove os dois
        removeFromScene(shotsList[i].tiro(), 0); //Remove tiro da cena
        shotsList.splice(i, 1); //Remove tiro do vetor

        enemyList[j].changeColor(); //Altera a cor: animação
        enemyList[j].rotate();
        removeFromScene(enemyList[j].cube, 0.5); //Remove da cena apos 0.5 segundos
        enemyList.splice(j, 1); //Remove do vetor

        break;
      }
    }
    if (distance > maxDistanceShot) {
      //Remove o tiro se ele esta longe do jogador: fora da tela
      removeFromScene(shotsList[i].tiro(), 0);
      shotsList.splice(i, 1);
    }
  }
}

function removeAirplaneCollision() {
  
  for (var i = 0; i < enemyList.length; i++)
    if (detectCollisionCubes(player.cone, enemyList[i].cube)) {
      restart();
    }
}

function removeAirplaneOutPlane() {
  for (var i = 0; i < enemyList.length; i++) {
    if (enemyList[i].cube.position.z > cameraHolder.position.z) {
      // remove o inimigo que já não está mais visivel
      removeFromScene(enemyList[i].cube, 0);
      enemyList.splice(i, 1);
    }
  }
}

function removeFromScene(obj, timeSegundos) {
  setTimeout(function () {
    scene.remove(obj);
  }, timeSegundos * 1000); // funcao que remove da cena com uma animação
}
//----------------------------------------------------------------------

//------------------------------ Updates ------------------------------------

function updateShots() {
  for (var i = 0; i < shotsList.length; i++)
    shotsList[i].moveInZ(-speed * 20, 0.1);
}
function updateAllEnemys() {
  for (var i = 0; i < enemyList.length; i++) enemyList[i].moveInZContinuo(-5);
}

function updateAnimations() {
  updateAllEnemys();
  updateShots();
  renderInfinityPlane();
  cameraHolder.translateZ(-speed);
  player.moveInZContinuo(-speed, 1);
}

//------------------------------------------------------------------------

//----------------------------RENDER------------------------

function renderInfinityPlane() {
  if (cameraHolder.position.z < limiterPlane) {
    limiterPlane += -planeSize;

    if (controlsPlane % 2 == 0) plane.position.z = limiterPlane;
    else plane2.position.z = limiterPlane;

    controlsPlane += 1;
  }
}

function render() {
  if (start) {
    updateAnimations();
    gerEnemy();
    removeAirplaneCollision();
  }
  keyboardCamera();
  removeShotsCollisionsAndOutPlane();
  requestAnimationFrame(render);
  removeAirplaneOutPlane();
  renderer.render(scene, camera);
}

//--------------------Configs-----------------------------------

function configCamera() {
  //Cria a camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.2,
    1000
  );
  //configura a camera
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

  //Congigurações da camera holder
  cameraHolder = new THREE.Object3D();
  cameraHolder.add(camera);
  cameraHolder.position.set(0, 30, 0);
  scene.add(cameraHolder);
}

function createPlanes() {
  //Criar plano
  plane = createGroundPlaneWired(planeSize, planeSize, 50, 50);
  plane2 = createGroundPlaneWired(planeSize, planeSize, 50, 50);
  //Add plano na cena
  scene.add(plane);
  scene.add(plane2);
  //Set a posição do plano
  plane.position.z = 0;
  plane2.position.z = -planeSize;

  //Configurações de controle do plano
  limiterPlane = -planeSize;
  controlsPlane = 0;
}
//--------------------------------------------------------

//----------------------- Outros -------------------------

function detectCollisionCubes(object1, object2) {
  object1.geometry.computeBoundingBox();
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();

  let box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);

  let box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);

  return box1.intersectsBox(box2);
}

function gerEnemy() {
  // Numero maximo de inimigos: 6
  if (enemyList.length < 6) {
    //ADD novo avião lista de inimigos ainda vivos
    enemyList.push(
      new AirplaneEnemy(
        0.5,
        2,
        -60 + Math.floor(Math.random() * 101), //valor da coordenada x. minimo: -60 maximo 60
        5,
        player.getVectorPosition().z - (90 + Math.floor(Math.random() * 11)), //Gera um z para distância inicial do inimigo. Distância minima: 90 maxima: 100
        Math.random() * (0.0001 - 0.0004),
        true
      )
    );
  }
  for (var i = 0; i < enemyList.length; i++) scene.add(enemyList[i].cube); // add inimigos na cena
}

//---------------------------------------------------------
function restart() {
  start = false;
  player.atingido();
  setTimeout(function () {
    for (var i = 0; i < enemyList.length; i++)
      removeFromScene(enemyList[i].cube, 0); //Remove da cena

    enemyList.splice(0, enemyList.length); // Remove lista
    plane.position.z = 0; //Reseta os planos
    plane2.position.z = -planeSize;
    cameraHolder.position.z = 0; //Reseta a camera
    player.setPosition(posInitPlayerX, posInitPlayerY, posInitPlayerZ); //Reseta o player

    start = true;
    player.rotate();
  }, 1000);
}

function createPlayer() {
  player = new AirplanePlayer(
    0.5,
    2,
    posInitPlayerX,
    posInitPlayerY,
    posInitPlayerZ,
    0.005,
    false
  );
}
