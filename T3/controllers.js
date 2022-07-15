//* Configurações gerais do jogo
import * as THREE from "three";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";

let scene = new THREE.Scene(); // Create main scene
let scene2 = new THREE.Scene(); // Create main scene
let loader = new GLTFLoader();

var max_axle_x = 36; //Distância máxima que o AVIÃO pode percorrer no eixo x
var min_axle_x = -max_axle_x; //Distância mínima que o AVIÃO pode percorrer no eixo x

var max_axle_z = 80; //Distância máxima que o AVIÃO pode percorrer no eixo z baseado na posição da câmera

var maxDistanceShot = max_axle_z;

//* Sobre o Player

var shotPerSecond = 2;

var posInitPlayerX = 0;
var posInitPlayerY = 10;
var posInitPlayerZ = -20;

//*Sobre o inimigo
var speedEnemy = 0.2;
var enemyShotPerSecond = 0.5; //Tiros por segundo do inimigo. 0.5 = um tiro a cada 2 segundos

export {
  scene,
  scene2,
  loader,
  max_axle_x,
  min_axle_x,
  maxDistanceShot,
  posInitPlayerX,
  posInitPlayerY,
  posInitPlayerZ,
  shotPerSecond,
  enemyShotPerSecond,
  speedEnemy,
};
