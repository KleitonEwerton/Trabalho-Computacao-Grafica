import * as THREE from "three";
import { AirMissile } from "./airMissile.js";
import { LandMissile } from "./landMissile.js";

import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { scene } from "./main.js";
import { audioLoader, listener } from "./audioSystem.js";
import {explosionSoundVolume} from "./controllers.js";

let loader = new GLTFLoader();
let max_inclination = 40;
let inclination_per_click = 40;
export class Airplanes {
  constructor(posx, posy, posz, speed, path, geometry, material) {
    this.speed = speed;
    this.isEnemy = true;
    this.life = 5;
    this.inclination = 0.0;
    const afterload = (object) => {
      this.obj = object;
      this.obj.castShadow = true;
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

    //scene.add(this.airplane);  //! Para ver o cone retire o comentário dessa linha
    this.sound = new THREE.Audio(listener);
    const load = (buffer) => {
      this.sound.setBuffer(buffer); //Set buffer in obj shot
      this.sound.setVolume(explosionSoundVolume); //Volume
    };
    audioLoader.load("./" + extraPath +"assets/sounds/explosionAirplanes.mp3", function (buffer) {
      load(buffer);
    });
  }
  airplane() {
    return this.airplane;
  }

  moveInX(qntMove) {
    if (this.obj != undefined) {
      this.vectorPosition.x += 1.9 * qntMove;
      this.airplane.position.lerp(this.vectorPosition, 5 * this.speed);

      if (qntMove > 0 && this.inclination > -max_inclination) {
        this.obj.rotateX((-inclination_per_click * Math.PI) / 180);
        this.inclination -= inclination_per_click;
      } else if (qntMove < 0 && this.inclination < max_inclination) {
        this.obj.rotateX((inclination_per_click * Math.PI) / 180);
        this.inclination += inclination_per_click;
      }
    }
  }

  resetInclination() {
    if (this.obj != undefined) {
      this.obj.rotateX(-this.inclination * (Math.PI / 180));
      this.inclination = 0.0;
    }
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
      this.isEnemy,
      this.getVectorPosition()
    );

    scene.add(tir.tiro());
    tiros.push(tir);
  }
  shotLand(scene, tiros) {
    let tir = new LandMissile(
      this.vectorPosition.x,
      this.vectorPosition.y,
      this.vectorPosition.z - 2,
      this.isEnemy,
      this.getVectorPosition()
    );
    scene.add(tir.tiro());
    tiros.push(tir);
  }

  atingido() {
    this.sound.play();

    this.rotate();
  }
  rotate() {
    for (let i = 0; i < 180; i += 1)
      if (this.obj != undefined) 
        this.obj.rotateY(Math.PI /180);
  }
  getLife() {
    return this.life;
  }
  resetLife() {
    this.life = 5;
  }
  extraLife() {
    this.life += 1;
  }
  danoTomado(damage) {
    this.life = this.life - damage;
  }
}
