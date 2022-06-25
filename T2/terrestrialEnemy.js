import { AirplaneEnemy } from "./airplaneEnemy.js";
import {LandMissileEnemy} from "./landMissileEnemy.js";
import * as THREE from "three";

const geometry = new THREE.BoxGeometry(8, 10, 8);

export class TerrestrialEnemy extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, scene, angleY) {
    super(posx, posy, posz, speed, scene, angleY, "./assets/enemy4/scene.gltf", geometry, 2);
  }

  moveInZContinuo(){

    //Não se movimenta

  }

  shot(scene, tiros, vectorPlayer) {
    
    this.vectorPosition.copy(this.cube.position);

    let tir = new LandMissileEnemy(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z,
      this.isEnemy,
      vectorPlayer
    );
    tir.rotateX();
    scene.add(tir.tiro());
    tiros.push(tir);
  }
}
