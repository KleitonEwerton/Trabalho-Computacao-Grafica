import { AirplaneEnemy } from "./airplaneEnemy.js";
import {LandMissileEnemy} from "./landMissileEnemy.js";
import * as THREE from "three";
import { scene, removeFromScene } from "./main.js";

const geometry = new THREE.BoxGeometry(6, 18, 22);

export class TerrestrialEnemy extends AirplaneEnemy {
  constructor(posx, posy, posz, speed,angleY) {
    super(posx, posy - 3, posz, speed, angleY, "./assets/enemy4/scene.gltf", geometry, 1);
    removeFromScene(this.cube);
  }

  moveInZContinuo(){}

  shot(tiros, vectorPlayer) {
    
    this.vectorPosition.copy(this.cube.position);

    let tir = new LandMissileEnemy(
      this.vectorPosition.x,
      this.vectorPosition.y - 0.3,
      this.vectorPosition.z - 2,
      vectorPlayer
    );
    tir.rotateX();
    tiros.push(tir);
  }
 
}
