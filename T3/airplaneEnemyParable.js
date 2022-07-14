import * as THREE from "three";
import { AirplaneEnemy } from "./airplaneEnemy.js";


const geometry = new THREE.BoxGeometry(7, 2, 7);
export class AirplaneEnemyParable extends AirplaneEnemy {
  constructor(posx, posy, posz, speed, angleY) {
    super(
      posx,
      posy,
      posz,
      speed,
      
      angleY,
      "./assets/enemy2/scene.glb",
      geometry,
      1
      
    );
    this.angle_rotateY = angleY;
    if (posx > 0) this.direction_rotateY = -1;
    else this.direction_rotateY = 1;
  }
  moveInZContinuo() {
    if (this.obj != undefined) {
      this.cube.translateZ(this.speed);
      this.cube.rotateY(this.direction_rotateY * this.angle_rotateY);
      this.obj.rotateY(this.direction_rotateY * this.angle_rotateY);
      this.vectorPosition.copy(this.cube.position);
      let vector = new THREE.Vector3().copy(this.cube.position);
      vector.y = 10;
      this.obj.position.lerp(vector, 1);
    }
  }
}
