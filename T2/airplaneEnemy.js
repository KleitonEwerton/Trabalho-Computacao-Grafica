import * as THREE from "three";
import { Projetil } from "./projetil.js";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";

const colors = [
  { color: "0xff0000", "sub-color": "0xff3232" },
  { color: "0x0000ff", "sub-color": "0x3232ff" },
  { color: "0x85f2ad", "sub-color": "0x9df4bd" },
  { color: "0x323232", "sub-color": "0x5a5a5a" },
  { color: "0x721220", "sub-color": "0x8e414c" },
  { color: "0xe5b513", "sub-color": "0xeac342" },
  { color: "0xcccccc", "sub-color": "0xffffff" },
  { color: "0xe5dcd6", "sub-color": "0xeae3de" },
  { color: "0x85f2ad", "sub-color": "0xb0f6ca" }
];

const geometry = new THREE.BoxGeometry(4, 2, 4);
let loader = new GLTFLoader();

export class AirplaneEnemy {
  constructor(altura, largura, posx, posy, posz, speed, scene) {
    this.altura = altura;
    this.largura = largura;
    this.isEnemy = true;
    this.speed = speed;

    let material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(posx, posy, posz);

    const afterload = (object) => {
      this.obj = object;
      scene.add(this.obj);
    };

    returnFBX("./assets/u.glb");
    function returnFBX(PATH) {
      loader.load(PATH, function (object) {
        object.scene.position.set(posx, posy, posz);
        object.scene.scale.set(0.5,0.5,0.5);
        object.scene.rotateY(-1.55);
        object.scene.rotateZ(0.2);

        afterload(object.scene);
      });
    }

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cube.position);
    //Numero da cor do aviao
    this.numerColor = Math.floor(Math.random() * colors.length);
    //Muda a cor do aviao
    this.color = colors[this.numerColor]["color"];
    this.cube.material.color.setHex(this.color);
  }
  cube() {
    return this.cube();
  }

  moveInX(qntMove) {
    this.vectorPosition.x += 1.2 * qntMove;
    this.cube.position.lerp(this.vectorPosition, 4 * this.speed);
  }

  moveInZ(qntMove) {
    this.vectorPosition.z += qntMove;
    this.cube.position.lerp(this.vectorPosition, this.speed);
    if(this.obj != undefined)
    this.obj.position.set(this.vectorPosition);

  }

  moveInZContinuo(qntMove) {
    this.vectorPosition.z += qntMove;
    this.cube.position.lerp(this.vectorPosition, this.speed);

  }

  getVectorPosition() {
    return this.vectorPosition;
  }

  shot(scene, tiros) {
    let tir = new Projetil(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z,
      this.isEnemy,
      this.color
    );
    scene.add(tir.tiro());
    tiros.push(tir);
  }

  changeColor() {
    this.cube.material.color.setHex(colors[this.numerColor]["sub-color"]);
  }
  rotate(){
    for (let i = 0; i < 10;i += 0.001)
      this.cube.rotateY(THREE.Math.degToRad(i));
  }
}
