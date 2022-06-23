import * as THREE from "three";
import { Projeteis } from "./projeteis.js";

const geometry = new THREE.BoxGeometry(1, 1, 5);
let material = new THREE.MeshLambertMaterial();
/*

  sub classe de projeteis, é enviada para baixo e depois para frente na altura do avião que o disparou divido por dois

*/ 
export class LandMissile extends Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer) {

    super(posx, posy/2, posz, isEnemy, vectorPlayer, geometry,material);

  }
}
