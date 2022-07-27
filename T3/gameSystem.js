import { init } from "./main.js";
import { sound , loaded} from "./audioSystem.js";

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

export {loader};