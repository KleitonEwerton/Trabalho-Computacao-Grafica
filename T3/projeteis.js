import * as THREE from "three";
import { scene, removeFromScene } from "./main.js";
import { listener } from "./audioSystem.js";

const audioLoader = new THREE.AudioLoader();

export class Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer, geometry, material) {
    this.enemy = isEnemy;
    this.shot = new THREE.Mesh(geometry, material);

    this.shot.position.set(posx, posy, posz);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.shot.position);

    this.damage = 1;

    if (isEnemy) {
      this.shot.lookAt(vectorPlayer);
    }

    const load = (thing) => {
      this.shot.add(thing);
    };
    
    if (!isEnemy) {
      let sound = new THREE.Audio(listener);
      audioLoader.load("assets/sounds/pulsar.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setVolume(0.5);
        sound.play();
        load(sound);
      });
    }

    scene.add(this.shot);
  }
  tiro() {
    return this.shot;
  }

  moveInZ(qntMove, alpha) {
    this.vectorPosition.z += 2 * qntMove;
    this.shot.position.lerp(this.vectorPosition, alpha);
  }
  move(qnt) {
    this.shot.translateZ(qnt);
  }

  getVectorPosition() {
    this.vectorPosition.copy(this.shot.position);
    return this.vectorPosition;
  }
  removed(time = 0) {
    removeFromScene(this.shot, time * 1000);
  }
}
