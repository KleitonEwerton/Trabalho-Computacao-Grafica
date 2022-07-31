import { init } from "./main.js";
import { sound, loaded } from "./audioSystem.js";
import { restart, gameCheat, gamePause } from "./main.js";

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
  setTimeout(function () {
    restartButton.style.display = "none";
    document.getElementById("flex-box").style.display = "none";
    document.getElementById("webgl-output").style.display = "block";
  }, 1000);
  restart();
});

function restartDisplay() {
  setTimeout(function () {
    restartButton.style.display = "none";
    document.getElementById("flex-box").style.display = "none";
    document.getElementById("webgl-output").style.display = "block";
  }, 1000);
  restart();
}

if (mobile) {
  const pauseButton = document.getElementById("btn-p");
  pauseButton.addEventListener("click", () => {
    gamePause();
  });

  const cheatButton = document.getElementById("btn-g");
  cheatButton.addEventListener("click", () => {
    gameCheat();
  });
}

export { loader, restartDisplay };
