import * as THREE from "three";
import {loader} from "./gameSystem.js";

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
var loaded = false;
// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

await audioLoader.load("./" + extraPath +"assets/sounds/bg.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.05);
  loaded = true;
  startButton.style.display = "block";
  loader.style.display = "none";

  startButton.style.backgroundColor = "white";
});

export { audioLoader, sound, listener, loaded };
