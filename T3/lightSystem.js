import * as THREE from "three";
import { createLightSphere } from "../libs/util/util.js";
import { scene } from "./main.js";
//----------------------------- CONFIGURAÇÕES DE LUZ ---------------------------------//

let lightIntensity = 0.9;
let lightPosition = new THREE.Vector3(0.0, 30.0, 0.0);
let lightColor = "rgb(255,255,255)";

// Sphere to represent the light
let lightSphere = createLightSphere(scene, 2, 10, 10, lightPosition);

let dirLight = new THREE.DirectionalLight(lightColor);

setDirectionalLighting(lightPosition);
updateLightIntensity();

const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
shadowHelper.visible = true;
scene.add(shadowHelper);

let targetObject = new THREE.Object3D();
targetObject.position.set(0, 0, 0);
scene.add(targetObject);

dirLight.target = targetObject;
scene.add(dirLight.target);

//------------------------------------------------------------------------------------//

function setDirectionalLighting(position) {
  dirLight.position.copy(position);
  dirLight.castShadow = true;

  // Shadow settings
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.left = -150;
  dirLight.shadow.camera.right = 150;
  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.camera.top = 150;
  dirLight.shadow.bias = -0.0005;

  // No effect on Basic and PCFSoft
  dirLight.shadow.radius = 4;

  scene.add(dirLight);
}

// Update light intensity of the current light
function updateLightIntensity() {
  dirLight.intensity = lightIntensity;
}

// Update light position of the current light
function updateLightPosition() {
  dirLight.target.updateMatrixWorld();
  dirLight.position.copy(lightPosition);
  lightSphere.position.copy(lightPosition);
  dirLight.shadow.camera.updateProjectionMatrix();
  shadowHelper.update();
}

export { updateLightPosition, targetObject, lightPosition};
