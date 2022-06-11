import * as THREE from "three";
import { Projetil } from "./projetil.js";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";

const geometry = new THREE.ConeGeometry(1.5, 3.5, 30);
let material = new THREE.MeshLambertMaterial({ color: 0x00ff000 });
let loader = new GLTFLoader();
export var objs = [];

export class AirplanePlayer {
  constructor(altura, largura, posx, posy, posz, speed, scene) {
    this.altura = altura;
    this.largura = largura;
    this.speed = speed;
    

    const afterload = (object) => {
      this.obj = object;
      scene.add(this.obj);
    };

    returnFBX("./assets/u.glb");
    function returnFBX(PATH) {
      loader.load(PATH, function (object) {
        object.scene.position.set(0, 5, -20);
        object.scene.scale.set(0.5,0.5,0.5);
        object.scene.rotateY(-1.55);
        object.scene.rotateZ(0.2);

        afterload(object.scene);
      });
    }

    this.cone = new THREE.Mesh(geometry, material);
    this.cone.position.set(posx, posy, posz);

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cone.position);
    this.cone.rotateX(-89.6);
  }
  cone() {
    return this.cone;
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
    if(this.obj != undefined)
    this.obj.position.lerp(this.vectorPosition, alpha);
  }

  getVectorPosition() {
    return this.vectorPosition;
  }

  setPosition(posInitPlayerX, posInitPlayerY, posInitPlayerZ) {
    this.cone.position.set(posInitPlayerX, posInitPlayerY, posInitPlayerZ);
    this.vectorPosition.copy(this.cone.position);
  }
  getAviao(){
    return this.obj;
  }
  shot(scene, tiros) {
    let tir = new Projetil(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z - 2,
      false,
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
  rotate() {
    for (let i = 0; i < 360; i += 0.01)
      this.cone.rotateZ(THREE.Math.degToRad(i));
  }
}
