import * as THREE from "three";

import KeyboardState from "../libs/util/KeyboardState.js";

import { onWindowResize, createGroundPlaneWired } from "../libs/util/util.js";

import { enemys } from "./configs.js";
import {
  scene,
  scene2,
  max_axle_x,
  min_axle_x,
  maxDistanceShot,
  posInitPlayerX,
  posInitPlayerY,
  posInitPlayerZ,
  shotPerSecond,
  enemyShotPerSecond,
  speedEnemy,
} from "./controllers.js";

import { distanceBetweenTwoPointsXZ } from "./utils.js";

import { AirplanePlayer } from "./airplanePlayer.js";
import { AirplaneEnemy } from "./airplaneEnemy.js";
import { AirplaneEnemyParable } from "./airplaneEnemyParable.js";
import { AirplaneEnemyDiagonal } from "./AirplaneEnemyDiagonal.js";
import { TerrestrialEnemy } from "./terrestrialEnemy.js";

import { camera, cameraHolder, configCamera } from "./cameraSystem.js";
import { removeFirstSphere, resetSpheres } from "./lifeSystem.js";
import {
  updateLightPosition,
  targetObject,
  lightPosition,
} from "./lightSystem.js";
import { rechargeBattery, createRechargeCSG } from "./rechargeSystem.js";

import { audioLoader, sound } from "./audioSystem.js";

let keyboard,
  renderer,
  plane,
  plane2,
  planeSize,
  limiterPlane,
  controlsPlane,
  player,
  speed,
  moveSpeedAirplane,
  start,
  pause,
  cheating;

  let shotsList = [];
  let landShotsList = [];
  let enemyList = [];
  let landenemyList = [];
  let enemyShot = [];
  let contidos = [];

  //----------------------------- CONFIGURAÇÕES BASICAS---------------------------------//

  //camera virtual usada para visualização das esferas da vida
  var lookAtVec = new THREE.Vector3(0.0, 3.0, 0.0);
  var camPosition = new THREE.Vector3(0.0, 3.0, 2.0);
  var upVec = new THREE.Vector3(0.0, 1.0, 0.0);
  var vcWidth = 200;
  var vcHeidth = 100;
  var virtualCamera = new THREE.PerspectiveCamera(
    45,
    vcWidth / vcHeidth,
    1.0,
    20.0
  );

init();

export function init() {
  keyboard = new KeyboardState();

  planeSize = 500; //Tamanho do plano
  speed = 0.1;
  moveSpeedAirplane = 0.4;

  start = true;
  cheating = false;
  pause = false;

  //----------------------------------- RENDERER ---------------------------------------//

  renderer = new THREE.WebGLRenderer({ alpha: true });
  document.getElementById("webgl-output").appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap; // default

  //------------------------------------------------------------------------------------//

  configCamera();
  createPlanes();
  createPlayer();


  resetSpheres();

  
  virtualCamera.position.copy(camPosition);
  virtualCamera.up.copy(upVec);
  virtualCamera.lookAt(lookAtVec);


  render();
  renderer.autoClear = false;
  //funcao assincrona que realiza os disparos
  const myIntervalShots = window.setInterval(function () {
    if (start)
      enemyList.forEach((enemy) => {
        if (
          cameraHolder.position.distanceTo(enemy.getVectorPosition()) <
          maxDistanceShot
        )
          enemy.shot(enemyShot, player.getVectorPosition());
      });
    landenemyList.forEach((enemy) => {
      if (
        cameraHolder.position.distanceTo(enemy.getVectorPosition()) <
        maxDistanceShot
      )
        enemy.shot(enemyShot, player.getVectorPosition());
    });
  }, 1000 / enemyShotPerSecond);
}

function controlledRender() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.clear(); // Clean the window

  renderer.render(scene, camera);
  // Set virtual camera viewport
  var offset = 30;
  renderer.setViewport(offset, height - vcHeidth - offset, vcWidth, vcHeidth); // Set virtual camera viewport
  renderer.setScissor(offset, height - vcHeidth - offset, vcWidth, vcHeidth); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.setClearColor(0x000000, 0); // Use a darker clear color in the small viewport

  renderer.render(scene2, virtualCamera); // Render scene of the virtual camera
}
//----------------------- Controles ----------------------------------
let atirarM = true;
let atirar = true;

function keyboardCamera() {
  keyboard.update();

  if (start && !pause) {
    if (
      keyboard.pressed("up") &&
      player.airplane.position.z - moveSpeedAirplane >=
        cameraHolder.position.z - maxDistanceShot
    )
      player.moveInZ(-moveSpeedAirplane);

    if (
      keyboard.pressed("down") &&
      player.airplane.position.z + moveSpeedAirplane <=
        cameraHolder.position.z - 5
    )
      player.moveInZ(moveSpeedAirplane);

    let inclination = false;
    if (
      keyboard.pressed("left") &&
      player.airplane.position.x + moveSpeedAirplane >= min_axle_x
    ) {
      player.moveInX(-moveSpeedAirplane);
      inclination = true;
    }

    if (
      keyboard.pressed("right") &&
      player.airplane.position.x - moveSpeedAirplane <= max_axle_x
    ) {
      player.moveInX(moveSpeedAirplane);

      inclination = true;
    }

    if (!inclination) player.resetInclination();
    if (keyboard.pressed("ctrl")) {
      if (atirar) {
        atirar = false;
        setTimeout(function () {
          atirar = true;
          player.shot(scene, shotsList);
        }, 1000 / shotPerSecond);
      }
    }

    if (keyboard.pressed("space")) {
      if (atirarM) {
        atirarM = false;
        setTimeout(function () {
          atirarM = true;
          player.shotLand(scene, landShotsList);
        }, 1000 / shotPerSecond);
      }
    }
  }
  if (!start && keyboard.down("enter")) restart();

  if (keyboard.down("P")) {
    pause = !pause;
    if (pause) sound.pause();
    else sound.play();
  }

  if (keyboard.down("G")) cheating = !cheating;
}
//---------------------------------------------------------------------

//------------------------ Remoções ---------------------------

function removeShotsCollisionsAndOutPlane() {
  for (var i = 0; i < shotsList.length; i++) {
    //Calcula a distancia do tiro do player para remover
    let distance = distanceBetweenTwoPointsXZ(
      cameraHolder.position,
      shotsList[i].getVectorPosition()
    );

    let removed = false;

    if (distance > maxDistanceShot) {
      //Remove o tiro se ele esta longe do jogador: fora da tela
      removeFromScene(shotsList[i].tiro(), 0);
      shotsList.splice(i, 1);
      removed = true;
    }
    if (!removed)
      for (var j = 0; j < enemyList.length; j++)
        if (detectCollisionCubes(shotsList[i].tiro(), enemyList[j].cube)) {
          //Se colidir  com o enemy remove os dois
          removeFromScene(shotsList[i].tiro(), 0); //Remove tiro da cena
          shotsList.splice(i, 1); //Remove tiro do vetor

          enemyList[j].rotate();
          removeFromScene(enemyList[j].obj, 0.5); //Remove da cena apos 0.5 segundos

          removeFromScene(enemyList[j].cube, 0.5); //Remove da cena apos 0.5 segundos
          enemyList.splice(j, 1); //Remove do vetor

          break;
        }
  }
}

function removeLandShotCollisionsAndOutPlane() {
  for (var i = 0; i < landShotsList.length; i++) {
    //Calcula a distancia do tiro do player para remover

    let distance = distanceBetweenTwoPointsXZ(
      cameraHolder.position,
      landShotsList[i].getVectorPosition()
    );

    let removed = false;

    if (distance > maxDistanceShot) {
      //Remove o tiro se ele esta longe do jogador: fora da tela
      removeFromScene(landShotsList[i].tiro(), 0);
      landShotsList.splice(i, 1);
      removed = true;
    }
    if (!removed)
      for (var j = 0; j < landenemyList.length; j++) {
        if (
          detectCollisionCubes(landShotsList[i].tiro(), landenemyList[j].cube)
        ) {
          //Se colidir  com o enemy remove os dois
          removeFromScene(landShotsList[i].tiro(), 0); //Remove tiro da cena
          landShotsList.splice(i, 1); //Remove tiro do vetor

          landenemyList[j].rotate();
          removeFromScene(landenemyList[j].obj, 0.5); //Remove da cena apos 0.5 segundos

          removeFromScene(landenemyList[j].cube, 0.5); //Remove da cena apos 0.5 segundos
          landenemyList.splice(j, 1); //Remove do vetor

          break;
        }
      }
  }
}

function removeAirplaneCollision() {
  if (!cheating)
    for (let cont = 0; cont < enemyList.length; cont++) {
      if (detectCollisionCubes(player.airplane, enemyList[cont].cube)) {
        player.danoTomado(2);
        enemyList[cont].rotate();
        removeFromScene(enemyList[cont].cube, 0);
        removeFromScene(enemyList[cont].obj, 1);
        enemyList.splice(cont, 1);
        removeFirstSphere();
        removeFirstSphere();
        if (player.life <= 0) {
          start = false;
          player.atingido();
          sound.stop();
          removeAllEnemyShots();
        }
        return;
      }
    }
}

function removeAirplaneCollisionProjeteis() {
  if (!cheating) {
    for (let cont = 0; cont < enemyShot.length; cont++) {
      if (detectCollisionCubes(player.airplane, enemyShot[cont].tiro())) {
        for (let i = 0; i < enemyShot[cont].damage; i++) removeFirstSphere();

        player.danoTomado(enemyShot[cont].damage);
        enemyShot[cont].removed();
        enemyShot.splice(cont, 1);

        if (player.life <= 0) {
          start = false;
          player.atingido();
          sound.stop();
          removeAllEnemyShots();
        }
        return;
      }
    }
  }
}

function removeAirplaneOutPlane() {
  for (var i = 0; i < enemyList.length; i++) {
    if (
      enemyList[i].cube.position.z > cameraHolder.position.z ||
      enemyList[i].cube.position.x > 301 ||
      enemyList[i].cube.position.x < -301
    ) {
      removeFromScene(enemyList[i].obj, 0);
      removeFromScene(enemyList[i].cube, 0);
      enemyList.splice(i, 1);
    }
  }
}

function removeFromScene(obj, timeInSecond) {
  setTimeout(function () {
    scene.remove(obj);
  }, timeInSecond * 1000); // funcao que remove da cena com uma animação
}
//----------------------------------------------------------------------

//------------------------------ Updates ------------------------------------

function updateShots() {
  shotsList.forEach((enemy) => {
    enemy.moveInZ(-speed * 20, 0.5);
  });
}
function updateLandShots() {
  landShotsList.forEach((enemy) => {
    enemy.moveInZ(-speed * 20, 0.5);
  });
}

function updateAllEnemys() {
  enemyList.forEach((enemy) => {
    enemy.moveInZContinuo();
  });
}

function updateAnimations() {
  updateAllEnemys();
  updateShots();
  updateLandShots();
  renderInfinityPlane();
  cameraHolder.translateZ(-speed);
  player.moveInZContinuo(-speed, 1);

  targetObject.translateZ(-speed);
  lightPosition.z -= speed;
  updateLightPosition();

  enemyShot.forEach((enemy) => {
    enemy.move(1, player.getVectorPosition());
  });
}

//------------------------------------------------------------------------

//-----------------------------------RENDER-------------------------------

function renderInfinityPlane() {
  if (cameraHolder.position.z < limiterPlane) {
    limiterPlane += -planeSize;

    if (controlsPlane % 2 == 0) plane.position.z = limiterPlane;
    else plane2.position.z = limiterPlane;

    controlsPlane += 1;
  }
}

function render() {
  keyboardCamera();
  if (!pause) {
    if (start) {
      rechargeBattery();
      updateAnimations();
      gerEnemysByConfigs();
      removeAirplaneCollision();
      removeAirplaneCollisionProjeteis();
    }

    removeShotsCollisionsAndOutPlane();
    removeLandShotCollisionsAndOutPlane();
    removeEnemyShot();
    removeAirplaneOutPlane();
    controlledRender();
  }
  requestAnimationFrame(render);
}

function gerEnemysByConfigs() {
  let posCam = Math.round(cameraHolder.position.z, 0).toString();
  let enemy = enemys[posCam];
  if (enemy != undefined && contidos.indexOf(posCam) == -1) {
    contidos.push(posCam);

    let enemy_local;
    switch (enemy["type"]) {
      case "parable":
        enemy_local = gerAirplaneEnemyParable(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"],

          enemy["angleY"]
        );
        break;

      case "diagonal":
        enemy_local = gerAirplaneEnemyDiagonal(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"],

          enemy["angleY"]
        );
        break;
      case "normal":
        enemy_local = gerAirplaneEnemyNormal(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"]
        );
        break;

      case "terrestrial":
        enemy_local = gerTerrestrialEnemy(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"],

          enemy["angleY"]
        );
        landenemyList.push(enemy_local);
        return;

      case "recharge":
        createRechargeCSG(enemy["posx"]);
        return;
    }

    enemyList.push(enemy_local);
  }
}
function gerAirplaneEnemyNormal(posx, posy, posz, speed, angleY) {
  return new AirplaneEnemy(posx, posy, posz, speed, angleY);
}
function gerAirplaneEnemyDiagonal(posx, posy, posz, speed, angleY) {
  return new AirplaneEnemyDiagonal(posx, posy, posz, speed, angleY);
}
function gerAirplaneEnemyParable(posx, posy, posz, speed, angleY) {
  return new AirplaneEnemyParable(posx, posy, posz, speed, angleY);
}
function gerTerrestrialEnemy(posx, posy, posz, speed, angleY) {
  return new TerrestrialEnemy(posx, posy, posz, speed, angleY);
}
//--------------------Configs-----------------------------------

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

//---------------------------------------------------------
function removeAllEnemyShots() {
  enemyShot.forEach(function (item) {
    item.removed();
  });
  enemyShot.splice(0, enemyShot.length);
}

function restart() {
  sound.stop();
  removeAllEnemyShots();
  contidos.splice(0, contidos.length);

  setTimeout(function () {
    enemyList.forEach(function (enemy) {
      removeFromScene(enemy.cube, 0); //Remove da cena
      removeFromScene(enemy.obj, 0); //Remove da cena
    });

    enemyList.splice(0, enemyList.length);

    targetObject.position.z = 0;
    lightPosition.z = 0;
    updateLightPosition();

    plane.position.z = 0; //Reseta os planos
    plane2.position.z = -planeSize;
    cameraHolder.position.z = 0; //Reseta a camera
    player.setPosition(posInitPlayerX, posInitPlayerY, posInitPlayerZ); //Reseta o player

    start = true;
    player.rotate();
    player.resetLife();
    resetSpheres();
    sound.play();
  }, 1000);
}

function createPlayer() {
  player = new AirplanePlayer(
    posInitPlayerX,
    posInitPlayerY,
    posInitPlayerZ,
    0.005
  );
}

function removeEnemyShot() {
  for (let i = 0; i < enemyShot.length; i++) {
    if (
      enemyShot[i].getVectorPosition().distanceTo(player.getVectorPosition()) >
        maxDistanceShot ||
      enemyShot[i].getVectorPosition().z > cameraHolder.position.z
    ) {
      enemyShot[i].removed();
      enemyShot.splice(i, 1);
      break;
    }
  }
}

export {
  scene,
  scene2,
  player,
  start,
  cameraHolder,
  detectCollisionCubes,
  removeFromScene,
  camera,
  renderer,
};
