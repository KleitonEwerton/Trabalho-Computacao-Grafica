import * as THREE from "three";
import { initBasicMaterial } from "../libs/util/util.js";

export class Retangulo {
  constructor(altura, largura, posx, posy, posz) {
    let material = initBasicMaterial();
    this.altura = altura;
    this.largura = largura;

    let cubeGeometry = new THREE.BoxGeometry(largura, altura, largura);
    this.cube = new THREE.Mesh(cubeGeometry, material);
    this.cube.position.set(posx, posy, posz);

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cube.position);

    this.tiros = [];
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

  shot(scene) {
    let tir = new Tiro(
      0.2,
      0.2,
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z
    );
    scene.add(tir.tiro());
    this.tiros.push(tir);
  }

  updateShot(speed) {
    for (var i = 0; i < this.tiros.length; i++) {
      this.tiros[i].moveInZ(-speed, 0.1);
    }
  }
}

class Tiro {
  constructor(altura, largura, posx, posy, posz) {
    let material = initBasicMaterial();
    this.altura = altura;
    this.largura = largura;

    let shotGeometry = new THREE.BoxGeometry(largura, altura, largura);
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
