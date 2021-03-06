import * as THREE from "three";
import { Projetil } from "./projetil.js";

const geometry = new THREE.ConeGeometry(1.5, 3.5, 30);
let material = new THREE.MeshLambertMaterial({ color: 0x00ff000 });

export class AirplanePlayer {
  constructor(altura, largura, posx, posy, posz, speed, isEnemy) {
    this.altura = altura;
    this.largura = largura;
    this.isEnemy = isEnemy;
    this.speed = speed;

    this.cone = new THREE.Mesh(geometry, material);
    this.cone.position.set(posx, posy, posz);

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cone.position);
    this.cone.rotateX(-89.6);
    this.color = "0x00ff000";
  }
  cone() {
    return this.cone();
  }

  moveInX(qntMove) {
    this.vectorPosition.x += 1.9 * qntMove;
    this.cone.position.lerp(this.vectorPosition, 5 * this.speed);
  }

  moveInZ(qntMove) {
    this.vectorPosition.z += 1.4 * qntMove;
    this.cone.position.lerp(this.vectorPosition, this.speed);
  }

  moveInZContinuo(qntMove, alpha) {
    this.vectorPosition.z += qntMove;
    this.cone.position.lerp(this.vectorPosition, alpha);
  }

  getVectorPosition() {
    return this.vectorPosition;
  }

  setPosition(posInitPlayerX, posInitPlayerY, posInitPlayerZ) {
    this.cone.position.set(posInitPlayerX, posInitPlayerY, posInitPlayerZ);
    this.vectorPosition.copy(this.cone.position);
  }

  shot(scene, tiros) {
    let tir = new Projetil(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z - 2,
      this.isEnemy,
      this.color
    );
    scene.add(tir.tiro());
    tiros.push(tir);
  }

  atingido() {
    this.cone.material.color.setHex(0xff4c4c);
    this.rotate();
    setTimeout(function () {

      material.color.setHex(0x32ff32);
      
    }, 1000);
  }
  rotate(){
    for(let i = 0; i<360;i+= 0.01)this.cone.rotateZ(THREE.Math.degToRad(i));
  }
}
