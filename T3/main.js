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
  moveSpeedAirplane,
} from "./controllers.js";

import { distanceBetweenTwoPointsXZ } from "./utils.js";

import { AirplanePlayer } from "./airplanePlayer.js";
import { AirplaneEnemy } from "./airplaneEnemy.js";
import { AirplaneEnemyParable } from "./airplaneEnemyParable.js";
import { AirplaneEnemyDiagonal } from "./airplaneEnemyDiagonal.js";
import { TerrestrialEnemy } from "./terrestrialEnemy.js";
import { restartDisplay } from "./gameSystem.js";

// import { camera, cameraHolder, configCamera } from "./cameraSystem.js";
import { removeFirstSphere, resetSpheres } from "./lifeSystem.js";
import {
  updateLightPosition,
  targetObject,
  lightPosition,
} from "./lightSystem.js";
import { rechargeBattery, createRechargeCSG } from "./rechargeSystem.js";

import { sound } from "./audioSystem.js";
import { Buttons } from "../libs/other/buttons.js";
import { Water } from "./jsm/objects/Water2.js";

var buttons = new Buttons(onButtonDown, onButtonUp);

let keyboard,
  renderer,
  plane,
  plane2,
  planeSize,
  limiterPlane,
  controlsPlane,
  player,
  speed,
  start,
  pause,
  cheating,
  camera,
  cameraHolder,
  globalScaleWidth,
  globalScaleHeight,
  inclination,
  enterHabilistic,
  water,
  water2,
  dirtRight,
  dirtLeft,
  grassLeft,
  grassRight,
  dirtRight2,
  dirtLeft2,
  grassLeft2,
  grassRight2; //Permite o enter ser precionado apos o fim do game

enterHabilistic = false;
let shotsList = [];
let landShotsList = [];
let enemyList = [];
let landenemyList = [];
let enemyShot = [];
let contidos = [];

let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
//----------------------------- CONFIGURAÇÕES BASICAS---------------------------------//

//Escala global baseado no tamanho da tela
globalScaleWidth = window.innerWidth / 1920;
globalScaleHeight = window.innerHeight / 929;
inclination = false;

// https://yoannmoi.net/nipplejs/

if (mobile) {
  let joystickL = nipplejs.create({
    zone: document.getElementById("joystickWrapper1"),
    lockX: false, // only move on the Y axis?
    position: { top: "-80px", left: "80px" },
    size: 120,
    multitouch: true,
    maxNumberOfNipples: 2,
    mode: "static",
    restJoystick: true,
    shape: "circle",
    dynamicPage: true,
  });

  joystickL["0"].on("move", function (evt, data) {
    const forward = data.vector.y;
    const turn = data.vector.x;
    inclination = false;
    if (start && !pause) {
      if (
        turn > 0.1 &&
        player.airplane.position.x - moveSpeedAirplane <= max_axle_x
      ) {
        lftValue = 0;
        rgtValue = Math.abs(turn);
        inclination = true;
      } else if (
        turn < -0.1 &&
        player.airplane.position.x + moveSpeedAirplane >= min_axle_x
      ) {
        lftValue = Math.abs(turn);
        rgtValue = 0;
        inclination = true;
      }

      if (!inclination) player.resetInclination();

      if (
        forward > 0.3 &&
        player.airplane.position.z - moveSpeedAirplane >=
          cameraHolder.position.z - maxDistanceShot
      ) {
        fwdValue = Math.abs(forward);
        bkdValue = 0;
      } else if (
        forward < -0.3 &&
        player.airplane.position.z + moveSpeedAirplane <=
          cameraHolder.position.z - 5
      ) {
        fwdValue = 0;
        bkdValue = Math.abs(forward);
      }
    }
  });

  joystickL["0"].on("end", function (evt) {
    if (start && !pause) player.resetInclination();
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  });
}

function onButtonDown(event) {
  if (start && !pause)
    switch (event.target.id) {
      case "A":
        player.shot(scene, shotsList);
        break;
      case "B":
        player.shotLand(scene, landShotsList);
        break;
      case "full":
        buttons.setFullScreen();

        break;
    }
}

function onButtonUp(event) {}

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

export function init() {
  keyboard = new KeyboardState();

  planeSize = 600; //Tamanho do plano

  speed = 0.1;

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
    if (start && !pause) {
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
    }
  }, 1000 / enemyShotPerSecond);
}

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

  if (start && !pause && !mobile) {
    if (keyboard.pressed("up"))
      player.moveInZ(-moveSpeedAirplane, cameraHolder.position.z);

    if (keyboard.pressed("down"))
      player.moveInZ(moveSpeedAirplane, cameraHolder.position.z);

    inclination = false;
    if (keyboard.pressed("left")) {
      player.moveInX(-moveSpeedAirplane);
      inclination = true;
    }

    if (keyboard.pressed("right")) {
      player.moveInX(moveSpeedAirplane);

      inclination = true;
    }

    if (!inclination) player.resetInclination();

    if (keyboard.down("ctrl")) {
      if (!atirar) player.shot(scene, shotsList);
    }
    if (keyboard.pressed("ctrl")) {
      if (atirar) {
        atirar = false;
        setTimeout(function () {
          atirar = true;
          player.shot(scene, shotsList);
        }, 1000 / shotPerSecond);
      }
    }

    if (keyboard.down("space")) {
      if (!atirarM) player.shotLand(scene, landShotsList);
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
  if (enterHabilistic && !start && keyboard.down("enter")) restartDisplay();

  if (keyboard.down("P")) {
    gamePause();
  }

  if (keyboard.down("G")) gameCheat();
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
          endGame();
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
          endGame();
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
  if (mobile) {
    player.moveInX(moveSpeedAirplane * rgtValue);
    player.moveInX(moveSpeedAirplane * -lftValue);
    player.moveInZ(moveSpeedAirplane * bkdValue, cameraHolder.position.z);
    player.moveInZ(moveSpeedAirplane * -fwdValue, cameraHolder.position.z);
  }
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

    if (controlsPlane % 2 == 0) {
      plane.position.z = limiterPlane;
      water.position.z = limiterPlane;
      dirtLeft.position.z = limiterPlane;
      dirtRight.position.z = limiterPlane;
      grassLeft.position.z = limiterPlane;
      grassRight.position.z = limiterPlane;
    } else {
      plane2.position.z = limiterPlane;
      water2.position.z = limiterPlane;
      dirtLeft2.position.z = limiterPlane;
      dirtRight2.position.z = limiterPlane;
      grassLeft2.position.z = limiterPlane;
      grassRight2.position.z = limiterPlane;
    }

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

let lastTerretrial = 0;

function gerEnemysByConfigs() {
  let posCam = Math.round(cameraHolder.position.z, 0).toString();
  let enemy = enemys[posCam];
  if (enemy != undefined && contidos.indexOf(posCam) == -1) {
    contidos.push(posCam);

    switch (enemy["type"]) {
      case "parable":
        enemyList.push(
          gerAirplaneEnemyParable(
            enemy["posx"],
            enemy["posy"],
            posCam - 150,
            speedEnemy * enemy["alphaSpeed"],

            enemy["angleY"]
          )
        );
        return;
      case "diagonal":
        enemyList.push(
          gerAirplaneEnemyDiagonal(
            enemy["posx"],
            enemy["posy"],
            posCam - 150,
            speedEnemy * enemy["alphaSpeed"],

            enemy["angleY"]
          )
        );
        return;
      case "normal":
        enemyList.push(
          gerAirplaneEnemyNormal(
            enemy["posx"],
            enemy["posy"],
            posCam - 150,
            speedEnemy * enemy["alphaSpeed"]
          )
        );
        return;

      case "terrestrial":
        landenemyList.push(
          gerTerrestrialEnemy(
            enemy["posx"],
            enemy["posy"],
            posCam - 150,
            speedEnemy * enemy["alphaSpeed"],

            enemy["angleY"]
          )
        );

        return;

      case "recharge":
        createRechargeCSG(enemy["posx"]);
        return;
    }
  }
}
const geometry = new THREE.BoxGeometry(7, 2, 7);
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
  const textureLoader = new THREE.TextureLoader();

  const groundGeometry = new THREE.PlaneGeometry(100, planeSize);
  const groundMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.4,
  });
  //Create Planes
  plane = new THREE.Mesh(groundGeometry, groundMaterial);
  plane2 = new THREE.Mesh(groundGeometry, groundMaterial);
  plane.rotation.x = Math.PI * -0.5;
  plane2.rotation.x = Math.PI * -0.5;

  //Dirt
  const dirtGeometry = new THREE.PlaneGeometry(40, planeSize);
  const dirtMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.4,
  });
  dirtLeft = new THREE.Mesh(dirtGeometry, dirtMaterial);
  dirtLeft.rotation.x = Math.PI * -0.5;
  dirtLeft.translateX(-50);
  dirtLeft.position.y = -1;

  dirtRight = new THREE.Mesh(dirtGeometry, dirtMaterial);
  dirtRight.rotation.x = Math.PI * -0.5;
  dirtRight.translateX(50);
  dirtRight.position.y = -1;

  dirtLeft2 = new THREE.Mesh(dirtGeometry, dirtMaterial);
  dirtLeft2.rotation.x = Math.PI * -0.5;
  dirtLeft2.translateX(-50);
  dirtLeft2.position.y = -1;

  dirtRight2 = new THREE.Mesh(dirtGeometry, dirtMaterial);
  dirtRight2.rotation.x = Math.PI * -0.5;
  dirtRight2.translateX(50);
  dirtRight2.position.y = -1;

  //Grass
  const grassGeometry = new THREE.PlaneGeometry(200, planeSize);
  const grassMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.4,
  });
  grassLeft = new THREE.Mesh(grassGeometry, grassMaterial);
  grassLeft.rotation.x = Math.PI * -0.5;
  grassLeft.translateX(-160);
  grassLeft.translateZ(1.5);
  grassLeft.translateY(-1.5);

  grassRight = new THREE.Mesh(grassGeometry, grassMaterial);
  grassRight.rotation.x = Math.PI * -0.5;
  grassRight.translateX(160);
  grassRight.translateZ(1.5);
  grassRight.translateY(-1.5);

  grassLeft2 = new THREE.Mesh(grassGeometry, grassMaterial);
  grassLeft2.rotation.x = Math.PI * -0.5;
  grassLeft2.translateX(-160);
  grassLeft2.translateZ(1.5);
  grassLeft2.translateY(-1.5);

  grassRight2 = new THREE.Mesh(grassGeometry, grassMaterial);
  grassRight2.rotation.x = Math.PI * -0.5;
  grassRight2.translateX(160);
  grassRight2.translateZ(1.5);
  grassRight2.translateY(-1.5);

  //textures
  textureLoader.load("./" + extraPath +"assets/textures/stone.png", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.repeat.set(4, 4);
    groundMaterial.map = map;
    groundMaterial.needsUpdate = true;
  });

  textureLoader.load("./" + extraPath +"assets/textures/dirt.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.repeat.set(1, 10);
    dirtMaterial.map = map;
    dirtMaterial.needsUpdate = true;
  });

  textureLoader.load("./" + extraPath +"assets/textures/grama.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.repeat.set(4, 4);
    grassMaterial.map = map;
    grassMaterial.needsUpdate = true;
  });

  // waters
  const waterGeometry = new THREE.PlaneGeometry(110, planeSize);

  water = new Water(waterGeometry, {
    color: "#ffffff",
    scale: 4,
    flowX: 1,
    flowY: 1,
    textureWidth: 1024,
    textureHeight: 1024,
  });

  water.position.y = 1;
  water.rotation.x = Math.PI * -0.5;

  water2 = new Water(waterGeometry, {
    color: "#ffffff",
    scale: 4,
    flowX: 1,
    flowY: 1,
    textureWidth: 1024,
    textureHeight: 1024,
  });

  water2.position.y = 1;
  water2.rotation.x = Math.PI * -0.5;

  //Add plano na cena
  scene.add(plane);
  scene.add(water);
  scene.add(dirtRight);
  scene.add(dirtLeft);
  scene.add(grassRight);
  scene.add(grassLeft);

  scene.add(plane2);
  scene.add(water2);
  scene.add(dirtRight2);
  scene.add(dirtLeft2);
  scene.add(grassRight2);
  scene.add(grassLeft2);

  //Set a posição do plano
  plane.position.z = 0;
  water.position.z = 0;
  dirtRight.position.z = 0;
  dirtLeft.position.z = 0;
  grassLeft.position.z = 0;
  grassRight.position.z = 0;
  grassLeft.position.y = 2;
  grassRight.position.y = 2;

  plane2.position.z = -planeSize;
  water2.position.z = -planeSize;
  dirtRight2.position.z = -planeSize;
  dirtLeft2.position.z = -planeSize;
  grassLeft2.position.z = -planeSize;
  grassRight2.position.z = -planeSize;
  grassLeft2.position.y = 2;
  grassRight2.position.y = 2;

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

  landShotsList.forEach(function (item) {
    item.removed();
  });
  landShotsList.splice(0, landShotsList.length);
}

function removeAllShotsPlayer() {
  shotsList.forEach(function (item) {
    item.removed();
  });
  shotsList.splice(0, shotsList.length);
}

function restart() {
  sound.stop();
  removeAllEnemyShots();
  removeAllShotsPlayer();
  contidos.splice(0, contidos.length);

  setTimeout(function () {
    enemyList.forEach(function (enemy) {
      removeFromScene(enemy.cube, 0); //Remove da cena
      removeFromScene(enemy.obj, 0); //Remove da cena
    });

    enemyList.splice(0, enemyList.length);

    landenemyList.forEach(function (enemy) {
      removeFromScene(enemy.cube, 0); //Remove da cena
      removeFromScene(enemy.obj, 0); //Remove da cena
    });

    landenemyList.splice(0,  landenemyList.length);

    targetObject.position.z = 0;
    lightPosition.z = 0;
    updateLightPosition();

    //Resets planes
    plane.position.z = 0;
    water.position.z = 0;
    dirtRight.position.z = 0;
    dirtLeft.position.z = 0;
    grassLeft.position.z = 0;
    grassRight.position.z = 0;

    plane2.position.z = -planeSize;
    water2.position.z = -planeSize;
    dirtRight2.position.z = -planeSize;
    dirtLeft2.position.z = -planeSize;
    grassLeft2.position.z = -planeSize;
    grassRight2.position.z = -planeSize;

    cameraHolder.position.z = 0; //Reseta a camera
    player.setPosition(posInitPlayerX, posInitPlayerY, posInitPlayerZ); //Reseta o player

    start = true;
    enterHabilistic = false;

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

function endGame() {
  start = false;
  sound.stop();
  player.atingido();
  removeAllEnemyShots();
  removeAllShotsPlayer();

  setTimeout(() => {
    enterHabilistic = true;
    document.getElementById("webgl-output").style.display = "none";
    document.getElementById("flex-box").style.display = "flex";
    document.getElementById("restartButton").style.display = "block";
  }, 1000);
}

function gamePause() {
  if (start) {
    pause = !pause;
    if (pause) {
      sound.pause();
    } else sound.play();
  }
}
function gameCheat() {
  cheating = !cheating;
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
  globalScaleWidth,
  restart,
  gamePause,
  gameCheat,
};
