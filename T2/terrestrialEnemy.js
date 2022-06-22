import { AirplaneEnemy } from "./airplaneEnemy.js";
import * as THREE from "three";

const geometry = new THREE.BoxGeometry(4, 6, 4);

export class TerrestrialEnemy extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, scene, angleY) {
    super(posx, posy, posz, speed, scene, angleY, "./assets/enemy3/scene.gltf", geometry, 2);
  }

  moveInZContinuo(qntMove){

    //Não se movimenta

  }
}
