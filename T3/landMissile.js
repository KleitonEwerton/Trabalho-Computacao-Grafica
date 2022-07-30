import * as THREE from "three";
import { Projeteis } from "./projeteis.js";

const geometry = new THREE.SphereGeometry(0.5, 10, 10);
let material = new THREE.MeshLambertMaterial();
/*

  sub classe de projeteis, é enviada para baixo e depois para frente na altura do avião que o disparou divido por dois

*/
export class LandMissile extends Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer) {
    super(posx, posy, posz, isEnemy, vectorPlayer, geometry, material);
    this.initialPositionZ = posz;
    
  }
  moveInZ(qntMove, alpha, moveY = -1.5, limiteY = 3) {
    if (this.vectorPosition.y < 0) {
      this.removed();
      return;
    }
    this.vectorPosition.z += 2 * qntMove;
    if(this.vectorPosition.z < this.initialPositionZ - 15)
      this.vectorPosition.y += moveY;

    this.shot.position.lerp(this.vectorPosition, alpha);
  }
}
