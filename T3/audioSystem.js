import * as THREE from "three";
import {init} from "./main.js";

const startButton = document.getElementById( 'startButton' );
// startButton.addEventListener('click',()=>{

//   init();

// });

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

audioLoader.load("assets/sounds/bg.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.2);
  sound.play();
});

export { audioLoader, sound, listener };
