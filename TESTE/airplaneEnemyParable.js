import * as THREE from "three";
import { AirplaneEnemy } from "./airplaneEnemy.js";

export class AirplaneEnemyParable extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, scene, angleY) {
    super(
      posx,
      posy,
      posz,
      speed,
      scene,
      angleY
    );
    this.angle_rotateY = angleY;
    if(posx > 0)
      this.direction_rotateY = -1;
    else 
    this.direction_rotateY = 1;
  }
  moveInZContinuo(qntMove) {
    if (this.obj != undefined) {
      this.cube.translateZ(qntMove);
      this.cube.rotateY(this.direction_rotateY * this.angle_rotateY);
      this.obj.rotateY(this.direction_rotateY * this.angle_rotateY);
      this.vectorPosition.copy(this.cube.position);
      let vector = new THREE.Vector3().copy(this.cube.position);
      vector.y = 5;
      this.obj.position.lerp(vector, 1);
    }
  }
}
