import * as THREE from  'three';
import { initBasicMaterial } from "../libs/util/util.js";


const geometry = new THREE.SphereGeometry( 0.6, 32, 16 );
let material = new THREE.MeshLambertMaterial();
export class Projetil {
  constructor(posx, posy, posz, isEnemy, hexColor) {

    this.enemy = isEnemy; 
   
    this.shot = new THREE.Mesh( geometry, material );
    
    this.shot.material.color.setHex( hexColor);

    this.shot.position.set(posx, posy, posz);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.shot.position);
  }
  tiro() {
    return this.shot;
  }

  moveInZ(qntMove, alpha) {
    this.vectorPosition.z += 2 * qntMove;
    this.shot.position.lerp(this.vectorPosition, alpha);
  }
  
  getVectorPosition() {
    return this.vectorPosition;
  }
  
}