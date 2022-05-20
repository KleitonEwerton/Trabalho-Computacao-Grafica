import * as THREE from "three";
import { FaceColors } from "../build/three.module.js";
import { initBasicMaterial } from "../libs/util/util.js";

export class Airplane {
  constructor(altura, largura, posx, posy, posz, isEnemy) {
    let material = initBasicMaterial();
    this.altura = altura;
    this.largura = largura;
    this.isEnemy = isEnemy;

    let cubeGeometry = new THREE.BoxGeometry(largura, altura, largura);
    this.cube = new THREE.Mesh(cubeGeometry, material);
    this.cube.position.set(posx, posy, posz);

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cube.position);

  }
  cube() {
    return this.cube();
  }

  moveInX(qntMove, alpha) {
    this.vectorPosition.x += qntMove;
    this.cube.position.lerp(this.vectorPosition, alpha);
  }

  moveInY(qntMove, alpha) {
    this.vectorPosition.y += qntMove;
    this.cube.position.lerp(this.vectorPosition, alpha);
  }
  moveInZ(qntMove, alpha) {
    this.vectorPosition.z += qntMove;
    this.cube.position.lerp(this.vectorPosition, alpha);
  }

  getVectorPosition() {
    return this.vectorPosition;
  }

  shot(scene, tiros) {
    let tir = new Tiro(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z, this.isEnemy
    );
    scene.add(tir.tiro());
    tiros.push(tir);
  }

 
}

let material = initBasicMaterial();
let shotGeometry = new THREE.BoxGeometry(0.5, 0.5,0.5);

class Tiro {
  constructor(posx, posy, posz, isEnemy) {

    this.enemy = isEnemy; 
    this.shot = new THREE.Mesh(shotGeometry, material);
    this.shot.position.set(posx, posy, posz);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.shot.position);
  }
  tiro() {
    return this.shot;
  }

  moveInZ(qntMove, alpha) {
    this.vectorPosition.z += qntMove;
    this.shot.position.lerp(this.vectorPosition, alpha);
  }

  getVectorPosition() {
    return this.vectorPosition;
  }
  
}
