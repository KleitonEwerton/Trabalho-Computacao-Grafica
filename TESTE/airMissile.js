import * as THREE from "three";
import { Projeteis } from "./projeteis.js";


const geometry = new THREE.SphereGeometry(0.6, 32, 16);
let material = new THREE.MeshLambertMaterial();
/*
  sub classe de projeteis, é enviada diretamente para frente na altura do avião que o disparou

*/
export class AirMissile extends Projeteis {

  constructor(posx, posy, posz, isEnemy, vectorPlayer) {
    super(posx, posy, posz, isEnemy, vectorPlayer, geometry,material);
  }
  
}
