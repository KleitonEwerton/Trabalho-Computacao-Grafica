import * as THREE from "three";

export class Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer, geometry, material) {
    this.enemy = isEnemy;
    this.shot = new THREE.Mesh(geometry, material);

    this.shot.position.set(posx, posy, posz);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.shot.position);

    this.damage = 1;

    if (isEnemy) {
      this.shot.lookAt(vectorPlayer);
    }
    
  }
  tiro() {
    return this.shot;
  }

  moveInZ(qntMove, alpha) {
    this.vectorPosition.z += 2 * qntMove;
    this.shot.position.lerp(this.vectorPosition, alpha);
  }
  move(qnt, vectorPlayer = null) {
    this.shot.translateZ(qnt);
  }
  
  getVectorPosition() {
    this.vectorPosition.copy(this.shot.position);
    return this.vectorPosition;
  }

}
