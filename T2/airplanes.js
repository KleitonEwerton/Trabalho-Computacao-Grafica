import * as THREE from "three";
import { AirMissile } from "./airMissile.js";
import { LandMissile } from "./landMissile.js";

import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";

let loader = new GLTFLoader();

export class Airplanes {
  constructor(posx, posy, posz, speed, scene, path, geometry, material) {
    this.speed = speed;

    const afterload = (object) => {
      this.obj = object;
      scene.add(this.obj);
    };

    returnFBX(path);
    function returnFBX(PATH) {
      loader.load(PATH, function (object) {
        object.scene.position.set(posx, posy, posz);
        object.scene.scale.set(0.5, 0.5, 0.5);
        object.scene.rotateY((3 * Math.PI) / 2);

        object.scene.traverse(function (child) {
          if (child) child.castShadow = true;
        });

        afterload(object.scene);
      });
    }

    this.airplane = new THREE.Mesh(geometry, material);
    this.airplane.position.set(posx, posy, posz);
    this.airplane.rotateX((3 * Math.PI) / 2);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.airplane.position);

    // scene.add(this.airplane);  //! Para ver o cone retire o comentário dessa linha
  }
  airplane() {
    return this.airplane;
  }

  moveInX(qntMove) {
    this.vectorPosition.x += 1.9 * qntMove;
    this.airplane.position.lerp(this.vectorPosition, 5 * this.speed);
  }

  moveInZ(qntMove) {
    if (this.obj != undefined) {
      this.vectorPosition.z += 1.4 * qntMove;
      this.airplane.position.lerp(this.vectorPosition, this.speed);
      this.obj.position.lerp(this.vectorPosition, this.speed);
    }
  }

  moveInZContinuo(qntMove, alpha) {
    if (this.obj != undefined) {
      this.vectorPosition.z += qntMove;
      this.airplane.position.lerp(this.vectorPosition, alpha);
      this.obj.position.lerp(this.vectorPosition, alpha);
    }
  }

  getVectorPosition() {
    return this.vectorPosition;
  }

  setPosition(posInitPlayerX, posInitPlayerY, posInitPlayerZ) {
    this.airplane.position.set(posInitPlayerX, posInitPlayerY, posInitPlayerZ);
    this.vectorPosition.copy(this.airplane.position);
  }
  getAviao() {
    return this.obj;
  }
  shot(scene, tiros) {
    let tir = new AirMissile(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z - 2,
      false,
      this.getVectorPosition()
    );
    scene.add(tir.tiro());
    tiros.push(tir);
  }

  atingido() {
    this.rotate();
  }
  rotate() {
    for (let i = 0; i < 360; i += 0.01)
      if (this.obj != undefined) this.obj.rotateY(THREE.Math.degToRad(i));
  }
}
