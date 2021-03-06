import * as THREE from "three";
import { AirMissile } from "./airMissile.js";
import { LandMissile } from "./landMissile.js";
import { Airplanes } from "./airplanes.js";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";

const geometry = new THREE.BoxGeometry(7, 2, 7);
let material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
let loader = new GLTFLoader();

export class AirplaneEnemy {
  constructor(posx, posy, posz, speed, scene, angleY = 0, path = "./assets/enemy1/scene.gltf", geometry_obj = geometry, scale=1.5) {
    this.isEnemy = true;
    this.speed = speed;
    this.cube = new THREE.Mesh(geometry_obj, material);
    this.cube.position.set(posx, posy, posz);
    this.cube.rotateY(angleY * (Math.PI / 180));
    
    //! Função auxiliar para trabalhar com a função assincrona loaderObject3D
    const afterload = (object) => {
      this.obj = object;
      this.obj.castShadow = true;
      scene.add(this.obj);
    };

    //! função assincrona loaderObject3D -> load objeto 3d
    function loaderObject3D(PATH) {
      loader.load(PATH, function (object) {
        object.scene.position.set(posx, posy, posz);
        object.scene.scale.set(scale, scale, scale);
        object.scene.rotateY(angleY * (Math.PI / 180));

        object.scene.traverse(function(child) {
          if(child)
          child.castShadow = true;
        });

        afterload(object.scene);
      });
    }

    loaderObject3D(path);

    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.cube.position);
    //scene.add(this.cube); //! Para ver o quadrado retire o comentário dessa linha
  }
  cube() {
    return this.cube();
  }

  moveInX(qntMove) {
    this.vectorPosition.x += 1.2 * qntMove;
    this.cube.position.lerp(this.vectorPosition, 4 * this.speed);
  }

  moveInZContinuo() {
    if (this.obj != undefined) {
      this.cube.translateZ(this.speed);
      this.vectorPosition.copy(this.cube.position);
      let vector = new THREE.Vector3().copy(this.cube.position);
      vector.y = 5;
      this.obj.position.lerp(vector, 1);
    }
  }

  getVectorPosition() {
    return this.vectorPosition;
  }

  shot(scene, tiros, vectorPlayer) {
    this.vectorPosition.copy(this.cube.position);

    let tir = new AirMissile(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z,
      this.isEnemy,
      vectorPlayer
    );

    scene.add(tir.tiro());
    tiros.push(tir);
  }

  changeColor() {}
  rotate() {
    for (let i = 0; i < 10; i += 0.001)
      if (this.obj != undefined) this.obj.rotateY(THREE.Math.degToRad(i));
  }
}
