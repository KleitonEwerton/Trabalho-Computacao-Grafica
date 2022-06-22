import * as THREE from "three";

import KeyboardState from "../libs/util/KeyboardState.js";

import {
  initRenderer,
  onWindowResize,
  createGroundPlaneWired,
  initDefaultBasicLight,
} from "../libs/util/util.js";

import { enemys } from "./configs.js";
import {
  max_axle_x,
  min_axle_x,
  maxDistanceShot,
  posInitPlayerX,
  posInitPlayerY,
  posInitPlayerZ,
} from "./controllers.js";

import { AirplanePlayer } from "./airplanePlayer.js";
import { AirplaneEnemy } from "./airplaneEnemy.js";
import { AirplaneEnemyParable } from "./airplaneEnemyParable.js";
import { AirplaneEnemyDiagonal } from "./AirplaneEnemyDiagonal.js";
import { TerrestrialEnemy } from "./terrestrialEnemy.js";

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

let list = [1, 2, 3, 4, 5, 6, 7];
let controler = 0;
while (controler < list.length) {
  const item = list[controler];
  if (item > 3) list.splice(controler, 1);
  else controler++;
}
console.log(list);
//------------------------------------------------------------------------------------//

scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
initDefaultBasicLight(scene); // Luz
configCamera();
createPlanes();
createPlayer();

let shotsList = [];
let shotsLandList = [];
let enemyList = [];
let enemyShot = [];
let contidos = [];

render();

//funcao assincrona que realiza os disparos
const myIntervalShots = window.setInterval(function () {
  if (start)
    enemyList.forEach((enemy) => {
      
      if(cameraHolder.position.distanceTo(enemy.getVectorPosition())<maxDistanceShot)
        enemy.shot(scene, enemyShot, player.getVectorPosition());
    });
}, 1000);

//----------------------- Controles ----------------------------------
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

    if (keyboard.down("ctrl")) player.shot(scene, shotsList);
    
    if (keyboard.down("space")) player.shotLand(scene, shotsList);

    if (keyboard.pressed("G")) cheating = !cheating;
  }
  if(!start){
    if (keyboard.down("enter")) restart();

  }
}
//---------------------------------------------------------------------

//------------------------ Remoções ---------------------------

function removeShotsCollisionsAndOutPlane() {
  for (var i = 0; i < shotsList.length; i++) {
    //Calcula a distancia do tiro do player para remover
    let distance = cameraHolder.position.distanceTo(
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

function removeAirplaneCollision() {
  enemyList.forEach((enemy) => {
    if (detectCollisionCubes(player.airplane, enemy.cube)) {
      start = false;
      player.atingido();
    }
  });
}

function removeAirplaneOutPlane() {
  for (var i = 0; i < enemyList.length; i++) {
    if (enemyList[i].cube.position.z > cameraHolder.position.z) {
      removeFromScene(enemyList[i].obj, 0); //Remove da cena apos 0.5 segundos
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
  shotsList.forEach((enemy) => {
    enemy.moveInZ(-speed * 20, 0.5);
  });
}

function updateAllEnemys() {
  enemyList.forEach((enemy) => {
    enemy.moveInZContinuo(0.2);
  });
}

function updateAnimations() {
  updateAllEnemys();
  updateShots();
  renderInfinityPlane();
  cameraHolder.translateZ(-speed);
  player.moveInZContinuo(-speed, 1);
  enemyShot.forEach((enemy) => {
    enemy.move(1);
  });
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
  keyboardCamera();

  if (start) {
    updateAnimations();
    gerEnemysByConfigs();
    if (!cheating) removeAirplaneCollision();
  }

  if (!cheating) removeShotsCollisionsAndOutPlane();
  removeEnemyShot();
  removeAirplaneOutPlane();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
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
          0.0001,
          scene,
          enemy["angleY"]
        );
        break;

      case "diagonal":
        enemy_local = gerAirplaneEnemyDiagonal(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          0.0001,
          scene,
          enemy["angleY"]
        );
        break;
      case "normal":
        enemy_local = gerAirplaneEnemyNormal(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          0.0001,
          scene
        );
        break;

        case "terrestrial":
        enemy_local = gerTerrestrialEnemy(
          enemy["posx"],
          enemy["posy"],
          cameraHolder.position.z - 150,
          0.0001,
          scene,enemy["angleY"]
        );
        break;
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
      maxDistanceShot
    ) {
      removeFromScene(enemyShot[i].shot, 0);
      enemyShot.splice(i, 1);
      break;
    }
  }
}
