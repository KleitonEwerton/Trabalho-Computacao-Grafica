import { scene2, player } from "./main.js";
import * as THREE from "three";

let sphereList = []; //Lista de esferas, marcadores de vida
let auxListSphere = []; //Lista auxiliar contendo todas as esferas

//Geometria e material da esfera
const geometry = new THREE.SphereGeometry(0.25, 32, 16);
const material = new THREE.MeshPhongMaterial();

const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0.0, 3.0, 0.0);

const sphere2 = new THREE.Mesh(geometry, material);
sphere2.position.set(0.5, 3.0, 0.0);

const sphere3 = new THREE.Mesh(geometry, material);
sphere3.position.set(1, 3.0, 0.0);

const sphere4 = new THREE.Mesh(geometry, material);
sphere4.position.set(-0.5, 3.0, 0.0);

const sphere5 = new THREE.Mesh(geometry, material);
sphere5.position.set(-1, 3.0, 0.0);

auxListSphere.push(sphere3);
auxListSphere.push(sphere2);
auxListSphere.push(sphere);
auxListSphere.push(sphere4);
auxListSphere.push(sphere5);

//Funcao para remover a esfera mais a direita da scene2
function removeFirstSphere() {
  scene2.remove(sphereList[0]);
  sphereList.splice(0, 1);
}

//Funcao que reseta todas as esferas na tela
function resetSpheres() {
  sphereList.splice(0, sphereList.length);
  auxListSphere.forEach((s) => {
    sphereList.push(s);
  });

  sphereList.forEach((s) => {
    scene2.add(s);
  });
}
//Funcao que recarrega uma esfera
function recoverySphere() {
  resetSpheres();
  for (let i = 0; i < 5 - player.getLife(); i++) removeFirstSphere();
}

export { removeFirstSphere, resetSpheres, recoverySphere };
