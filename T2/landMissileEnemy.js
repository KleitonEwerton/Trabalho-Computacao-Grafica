import * as THREE from "three";
import { Projeteis } from "./projeteis.js";

const geometry = new THREE.BoxGeometry(0.8, 0.8, 2.5);
let material = new THREE.MeshLambertMaterial();
/*

  sub classe de projeteis, é enviada para baixo e depois para frente na altura do avião que o disparou divido por dois

*/
export class LandMissileEnemy extends Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer) {
    super(posx, posy, posz, false, vectorPlayer, geometry, material);
    this.angleToUpper = 90;
    this.chegouAoTop = false;
    this.enemy = isEnemy;
    this.damage = 2;
  }
  
  move(qntMove, vectorPlayer,limiteY = 10) {
    if (this.vectorPosition.y + qntMove < limiteY)
      this.shot.translateZ(qntMove);

    else{
      if(!this.chegouAoTop){
        this.shot.rotateX(this.angleToUpper * (Math.PI / 180));
        
        this.shot.lookAt(vectorPlayer);
      }
      this.chegouAoTop = true;
      this.shot.translateZ(qntMove);
    }
  }
  rotateX(){
    this.shot.rotateX(-this.angleToUpper * (Math.PI / 180));
  }
}
