import * as THREE from "three";

import KeyboardState from "../libs/util/KeyboardState.js";

import {
  initRenderer,
  onWindowResize,
  createGroundPlaneWired,
  createLightSphere,
} from "../libs/util/util.js";

import { enemys } from "./configs.js";
import {
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
import { Recharge } from "./recharge.js";

let scene,
  keyboard,
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
  start,
  cheating;

//----------------------------- CONFIGURAÇÕES BASICAS---------------------------------//
keyboard = new KeyboardState();

planeSize = 500; //Tamanho do plano
speed = 0.1;
moveSpeedAirplane = 0.4;

start = true;
cheating = false;

//------------------------------------------------------------------------------------//

scene = new THREE.Scene(); // Create main scene
let scene2 = new THREE.Scene(); // Create main scene
//renderer = initRenderer(); // Init a basic renderer
//initDefaultBasicLight(scene); // Luz

//----------------------------------- RENDERER ---------------------------------------//

renderer = new THREE.WebGLRenderer({ alpha: true });
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default

//------------------------------------------------------------------------------------//

//----------------------------- CONFIGURAÇÕES DE LUZ ---------------------------------//

let lightIntensity = 0.9;
let lightPosition = new THREE.Vector3(0.0, 30.0, 0.0);
let lightColor = "rgb(255,255,255)";

// Sphere to represent the light
let lightSphere = createLightSphere(scene, 2, 10, 10, lightPosition);

let dirLight = new THREE.DirectionalLight(lightColor);

setDirectionalLighting(lightPosition);
updateLightIntensity();

const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
shadowHelper.visible = true;
scene.add(shadowHelper);

let targetObject = new THREE.Object3D();
targetObject.position.set(0, 0, 0);
scene.add(targetObject);

dirLight.target = targetObject;
scene.add(dirLight.target);

//------------------------------------------------------------------------------------//

configCamera();
createPlanes();
createPlayer();

let shotsList = [];
let landShotsList = [];
let enemyList = [];
let landenemyList = [];
let enemyShot = [];
let contidos = [];
let rechargeList = [];
let sphereList = [];

const geometry = new THREE.SphereGeometry(0.25, 32, 16);
const material = new THREE.MeshPhongMaterial({ color: "rgb(220,20,60)" });

const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0.0, 3.0, 0.0);

const sphere2 = new THREE.Mesh(geometry, material);
sphere2.position.set(0.5, 3.0, 0.0);

const sphere3 = new THREE.Mesh(geometry, material);
sphere3.position.set(1, 3.0, 0.0);

const sphere4 = new THREE.Mesh(geometry, material);
sphere4.position.set(-0.5, 3.0, 0.0);

const sphere5 = new THREE.Mesh(geometry, material);
sphere5.position.set(-1, 3.0, 0.0);

let auxListSphere = [];
auxListSphere.push(sphere3);
auxListSphere.push(sphere2);
auxListSphere.push(sphere);
auxListSphere.push(sphere4);
auxListSphere.push(sphere5);

resetSpheres();

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
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);

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
        enemy.shot(scene, enemyShot, player.getVectorPosition());
    });
  landenemyList.forEach((enemy) => {
    if (
      cameraHolder.position.distanceTo(enemy.getVectorPosition()) <
      maxDistanceShot
    )
      enemy.shot(scene, enemyShot, player.getVectorPosition());
  });
}, 1000 / enemyShotPerSecond);

//----------------------- Controles ----------------------------------
let atirarM = true;
let atirar = true;

function keyboardCamera() {
  keyboard.update();

  if (start) {
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

    if (
      keyboard.pressed("left") &&
      player.airplane.position.x + moveSpeedAirplane >= min_axle_x
    )
      player.moveInX(-moveSpeedAirplane);

    if (
      keyboard.pressed("right") &&
      player.airplane.position.x - moveSpeedAirplane <= max_axle_x
    )
      player.moveInX(moveSpeedAirplane);

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
  if (!start) {
    if (keyboard.down("enter")) restart();
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

          enemyList[j].changeColor(); //Altera a cor: animação
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

          landenemyList[j].changeColor(); //Altera a cor: animação
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
        }
        return;
      }
    }
}

function removeAirplaneCollisionProjeteis() {
  if (!cheating) {
    for (let cont = 0; cont < enemyShot.length; cont++) {
      if (detectCollisionCubes(player.airplane, enemyShot[cont].tiro())) {

        for(let i = 0; i < enemyShot[cont].damage;i++)
          removeFirstSphere();
          
        player.danoTomado(enemyShot[cont].damage);
        removeFromScene(enemyShot[cont].tiro(), 0);
        enemyShot.splice(cont, 1);

        if (player.life <= 0) {
          start = false;
          player.atingido();
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
  requestAnimationFrame(render);
  controlledRender();
}

function gerEnemysByConfigs() {
  let posCam = Math.round(cameraHolder.position.z, 0).toString();
  console.log(posCam);
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
          scene,
          enemy["angleY"]
        );
        break;

      case "diagonal":
        enemy_local = gerAirplaneEnemyDiagonal(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"],
          scene,
          enemy["angleY"]
        );
        break;
      case "normal":
        enemy_local = gerAirplaneEnemyNormal(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"],
          scene
        );
        break;

      case "terrestrial":
        enemy_local = gerTerrestrialEnemy(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          speedEnemy * enemy["alphaSpeed"],
          scene,
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
function gerAirplaneEnemyNormal(posx, posy, posz, speed, sc, angleY) {
  return new AirplaneEnemy(posx, posy, posz, speed, sc, angleY);
}
function gerAirplaneEnemyDiagonal(posx, posy, posz, speed, sc, angleY) {
  return new AirplaneEnemyDiagonal(posx, posy, posz, speed, sc, angleY);
}
function gerAirplaneEnemyParable(posx, posy, posz, speed, sc, angleY) {
  return new AirplaneEnemyParable(posx, posy, posz, speed, sc, angleY);
}
function gerTerrestrialEnemy(posx, posy, posz, speed, sc, angleY) {
  return new TerrestrialEnemy(posx, posy, posz, speed, sc, angleY);
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

//---------------------------------------------------------
function restart() {
  enemyShot.forEach(function (item) {
    removeFromScene(item.shot, 0);
  });
  enemyShot.splice(0, enemyShot.length);
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
  }, 1000);
}

function createPlayer() {
  player = new AirplanePlayer(
    posInitPlayerX,
    posInitPlayerY,
    posInitPlayerZ,
    0.005,
    scene
  );
}

function removeEnemyShot() {
  for (let i = 0; i < enemyShot.length; i++) {
    if (
      enemyShot[i].getVectorPosition().distanceTo(player.getVectorPosition()) >
        maxDistanceShot ||
      enemyShot[i].getVectorPosition().z > cameraHolder.position.z
    ) {
      removeFromScene(enemyShot[i].shot, 0);
      enemyShot.splice(i, 1);
      break;
    }
  }
}

function createRechargeCSG(posx) {
  if (start) {
    rechargeList.push(
      new Recharge(
        posx, //valor da coordenada x. minimo: -60 maximo 60
        posInitPlayerY,
        cameraHolder.position.z - maxDistanceShot, //Gera um z para distância inicial do inimigo. Distância minima: distância maxima do tir,  maxima:  distância maxima do tiro + 10
        scene
      )
    );
  }
}

function rechargeBattery() {
  for (var i = 0; i < rechargeList.length; i++)
    if (detectCollisionCubes(player.airplane, rechargeList[i].recargaObject)) {
      removeFromScene(rechargeList[i].recargaObject, 0); //Remove da cena
      removeFromScene(rechargeList[i].obj, 0); //Remove da cena
      
      if(player.getLife() < 5){
        rechargeList.splice(i, 1);
        player.extraLife();
        recoverySphere();
      }
     
      return;
    }
}

function setDirectionalLighting(position) {
  dirLight.position.copy(position);
  dirLight.castShadow = true;

  // Shadow settings
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.left = -150;
  dirLight.shadow.camera.right = 150;
  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.camera.top = 150;
  dirLight.shadow.bias = -0.0005;

  // No effect on Basic and PCFSoft
  dirLight.shadow.radius = 4;

  scene.add(dirLight);
}

// Update light intensity of the current light
function updateLightIntensity() {
  dirLight.intensity = lightIntensity;
}

// Update light position of the current light
function updateLightPosition() {
  dirLight.target.updateMatrixWorld();
  dirLight.position.copy(lightPosition);
  lightSphere.position.copy(lightPosition);
  dirLight.shadow.camera.updateProjectionMatrix();
  shadowHelper.update();
}

export function initLight(position) {
  const ambientLight = new THREE.HemisphereLight(
    "white", // bright sky color
    "darkslategrey", // dim ground color
    0.5 // intensity
  );

  const mainLight = new THREE.DirectionalLight("white", 0.7);
  mainLight.position.copy(position);
  mainLight.castShadow = true;

  const shadow = mainLight.shadow;
  shadow.mapSize.width = 1024;
  shadow.mapSize.height = 1024;
  shadow.camera.near = 0.1;
  shadow.camera.far = 50;
  shadow.camera.left = -100.0;
  shadow.camera.right = 100.0;
  shadow.camera.bottom = -100.0;
  shadow.camera.top = 100.0;

  scene.add(ambientLight);
  scene.add(mainLight);

  return mainLight;
}

function removeFirstSphere() {
  scene2.remove(sphereList[0]);
  sphereList.splice(0, 1);
}

function resetSpheres() {
  sphereList.splice(0, sphereList.length);
  auxListSphere.forEach(s=>{
    sphereList.push(s);
  });
  
  sphereList.forEach(s => {
    scene2.add(s);
  });
}
function recoverySphere() {
  
  resetSpheres();
  for(let i = 0; i < (5 - player.getLife()); i++) 
    removeFirstSphere();

}
