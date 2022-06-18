import * as THREE from "three";


export class Projeteis {

  constructor(posx, posy, posz, isEnemy, vectorPlayer, geometry, material) {
    console.log(vectorPlayer);
    this.enemy = isEnemy;
    this.transition = 1;
    this.shot = new THREE.Mesh(geometry, material);

    this.shot.position.set(posx, posy, posz);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.shot.position);

    if (isEnemy) {
      if (vectorPlayer.z < posz) this.transition = -1;
      let x = vectorPlayer.x - this.shot.position.x;
      let z = vectorPlayer.z - this.shot.position.z;
      let h = Math.sqrt(x * x + z * z);

      this.angleToPlayer = (vectorPlayer.x - this.vectorPosition.x) / h;
      this.shot.rotateY(this.transition * this.angleToPlayer);
    }
  }
  tiro() {
    return this.shot;
  }

  moveInZ(qntMove, alpha) {
    this.vectorPosition.z += 2 * qntMove;
    this.shot.position.lerp(this.vectorPosition, alpha);
  }
  move(qnt) {
    this.shot.translateZ(this.transition * qnt);
  }

  getVectorPosition() {
    this.vectorPosition.copy(this.shot.position);
    return this.vectorPosition;
  }
}
