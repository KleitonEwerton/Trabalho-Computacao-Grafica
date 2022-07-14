import * as THREE from "three";
import { AirMissile } from "./airMissile.js";
import { AirplaneEnemy } from "./airplaneEnemy.js";
import { scene, removeFromScene } from "./main.js";

const geometry = new THREE.BoxGeometry(7, 2, 10);
export class AirplaneEnemyDiagonal extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, angleY) {
    super(
      posx,
      posy,
      posz,
      speed,
      
      angleY, 
      "./assets/enemy3/scene.gltf", geometry,0.1

    );    
    
  }
  moveInZContinuo() {
    if (this.obj != undefined) {
      this.cube.translateZ(this.speed);
      this.vectorPosition.copy(this.cube.position);
      let vector = new THREE.Vector3().copy(this.cube.position);
      vector.y = 8;
      this.obj.position.lerp(vector, 1);
    }
  }
  
}
