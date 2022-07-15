import * as THREE from "three";
import { camera } from "./main.js";
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
// camera.add( listener );

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

try {
  audioLoader.load("assets/sounds/bg.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
} catch (e) {
  console.log("Audio de ambiente não encontrado");
}


export { audioLoader };
