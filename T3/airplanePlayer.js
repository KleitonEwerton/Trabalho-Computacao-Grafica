import * as THREE from "three";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { AirMissile } from "./airMissile.js";
import { Airplanes } from "./airplanes.js";

const geometry = new THREE.ConeGeometry(1.9, 10, 30);
let material = new THREE.MeshLambertMaterial({ color: 0x00ff000 });

export class AirplanePlayer extends Airplanes{
  constructor(posx, posy, posz, speed) {
  
    super(posx, posy, posz, speed,"./" + extraPath +"assets/player1/scene.glb",geometry, material);
    this.life = 5;
    this.isEnemy = false;
  }
  
}
