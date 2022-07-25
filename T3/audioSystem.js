import * as THREE from "three";
import { init } from "./main.js";

const startButton = document.getElementById("startButton");
const loader = document.getElementById("loader");
var loaded = false;

startButton.addEventListener("click", () => {
  if (loaded) {
    init();
    sound.play();
    startButton.style.display = "none";
    document.getElementById("flex-box").style.display="none";
  }
});

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

await audioLoader.load("assets/sounds/bg.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.05);
  loaded = true;
  startButton.style.display = "block";
  loader.style.display = "none";

  startButton.style.backgroundColor = "white";
});

export { audioLoader, sound, listener };
