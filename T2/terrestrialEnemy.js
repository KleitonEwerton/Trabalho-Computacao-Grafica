import { AirplaneEnemy } from "./airplaneEnemy.js";
import {LandMissileEnemy} from "./landMissileEnemy.js";
import * as THREE from "three";

const geometry = new THREE.BoxGeometry(5, 10, 5);

export class TerrestrialEnemy extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, scene, angleY) {
    super(posx, posy, posz, speed, scene, angleY, "./assets/enemy3/scene.gltf", geometry, 2);
  }

  moveInZContinuo(qntMove){

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
