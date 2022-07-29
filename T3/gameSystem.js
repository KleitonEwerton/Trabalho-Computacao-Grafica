import { init } from "./main.js";
import { sound , loaded} from "./audioSystem.js";
import {restart} from "./main.js";

const startButton = document.getElementById("startButton");
const loader = document.getElementById("loader");


startButton.addEventListener("click", () => {
  if (loaded) {
    init();
    sound.play();
    startButton.style.display = "none";
    document.getElementById("flex-box").style.display = "none";
  }
});

const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", () => {
  
    
    restartButton.style.display = "none";
    document.getElementById("flex-box").style.display = "none";
    document.getElementById("webgl-output").style.display = "block";
    setTimeout(function () {
      restart();
    }, 500);
  
});

export {loader};