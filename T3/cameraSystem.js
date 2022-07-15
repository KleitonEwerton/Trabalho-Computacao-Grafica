import * as THREE from "three";
import { onWindowResize } from "../libs/util/util.js";
import { scene, renderer} from "./main.js";

let camera,cameraHolder;

function configCamera() {
    //Cria a camera
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.2,
      1000
    );
    //configura a camera
    camera.position.set(0, 0, 1);
    camera.up.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    camera.rotateX(-1.7);
    scene.add(camera);
  
    window.addEventListener(
      "resize",
      function () {
        onWindowResize(camera, renderer);
      },
      false
    );
  
    //Congigurações da camera holder
    cameraHolder = new THREE.Object3D();
    cameraHolder.add(camera);
    cameraHolder.position.set(0, 30, 0);
    scene.add(cameraHolder);
  }

  export {configCamera,camera, cameraHolder};