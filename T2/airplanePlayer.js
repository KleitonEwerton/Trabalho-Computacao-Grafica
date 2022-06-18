import * as THREE from "three";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { AirMissile } from "./airMissile.js";
import { Airplanes } from "./airplanes.js";

const geometry = new THREE.ConeGeometry(2, 8, 30);
let material = new THREE.MeshLambertMaterial({ color: 0x00ff000 });

export class AirplanePlayer extends Airplanes{
  constructor(posx, posy, posz, speed, scene) {
  
    super(posx, posy, posz, speed, scene,"./assets/player.glb",geometry, material);

  }
  
}
