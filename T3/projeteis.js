import * as THREE from "three";
import { scene, removeFromScene } from "./main.js";
import { listener, audioLoader } from "./audioSystem.js";

export class Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer, geometry, material) {
    this.isEnemy = isEnemy;
    this.shot = new THREE.Mesh(geometry, material);

    this.shot.position.set(posx, posy, posz);
    this.vectorPosition = new THREE.Vector3();
    this.vectorPosition.copy(this.shot.position);

    this.damage = 1;

    if (isEnemy) {
      this.shot.lookAt(vectorPlayer);
    }

    if (!this.isEnemy) {
      this.sound = new THREE.Audio(listener);

      //Function to set loader in this.sound
      const load = (buffer) => {
        this.sound.setBuffer(buffer);//Set buffer in obj shot
        this.sound.setVolume(0.1); //Volume
        this.sound.play(); //Start sound
        this.shot.add(this.sound); //Add sound in obj shot
      };

      audioLoader.load("assets/sounds/pulsar.mp3", function (buffer) {
        load(buffer);//Call function load, to upload buffer
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
    if(this.sound)
      this.sound.stop();
    removeFromScene(this.shot, time * 1000);
  }
}
