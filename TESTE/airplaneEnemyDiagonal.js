import * as THREE from "three";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { AirMissile } from "./airMissile.js";
import { AirplaneEnemy } from "./airplaneEnemy.js";


export class AirplaneEnemyDiagonal extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, scene, angleY) {
    super(
      posx,
      posy,
      posz,
      speed,
      scene,
      angleY
    );    
    
  }
  
}
