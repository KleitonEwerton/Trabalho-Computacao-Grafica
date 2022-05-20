import * as THREE from "three";
import { FaceColors } from "../build/three.module.js";
import { initBasicMaterial } from "../libs/util/util.js";
import { Projetil } from "./projetil.js";

const geometry = new THREE.ConeGeometry(1, 3, 30);

export class Airplane {
  constructor(altura, largura, posx, posy, posz, isEnemy) {
    this.altura = altura;
    this.largura = largura;
    this.isEnemy = isEnemy;

    let material = new THREE.MeshLambertMaterial();
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(posx, posy, posz);

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cube.position);
    if (!isEnemy) {
      this.cube.material.color.setHex(0x00ff00);
      this.cube.rotateX(-89.6);
    }else {
      this.cube.material.color.setHex(0xff0000);
      this.cube.rotateX(89.6);}
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
    let tir = new Projetil(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z,
      this.isEnemy
    );
    scene.add(tir.tiro());
    tiros.push(tir);
  }
}
