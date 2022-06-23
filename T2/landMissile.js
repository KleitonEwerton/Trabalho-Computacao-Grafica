import * as THREE from "three";
import { Projeteis } from "./projeteis.js";

const geometry = new THREE.BoxGeometry(0.5, 0.5, 3);
let material = new THREE.MeshLambertMaterial();
/*

  sub classe de projeteis, é enviada para baixo e depois para frente na altura do avião que o disparou divido por dois

*/ 
export class LandMissile extends Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer) {

    super(posx, posy, posz, isEnemy, vectorPlayer, geometry,material);

  }
  moveInZ(qntMove, alpha, moveY = -0.8, limiteY = 5) {
    this.vectorPosition.z += 2 * qntMove;
    if(moveY && moveY + this.vectorPosition.y > limiteY) 
      this.vectorPosition.y += moveY;
    this.shot.position.lerp(this.vectorPosition, alpha);
  }
}
