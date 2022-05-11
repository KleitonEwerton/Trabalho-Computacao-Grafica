import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js'

import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ, createGroundPlaneWired} from "../libs/util/util.js";

class Retangulo {

  constructor(altura, largura) {

    this.altura = altura;
    this.largura = largura;

    let cubeGeometry = new THREE.BoxGeometry(largura, altura, largura);
    this.cube = new THREE.Mesh(cubeGeometry, material);
    this.cube.position.set(0, 10, -15.0);

  }
  cube(){
   return this.cube();
  }
}      


let keyboard = new KeyboardState();

let scene, renderer, camera, material, light; // variables 
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
material = initBasicMaterial(); // create a basic material

scene.add(new THREE.HemisphereLight());

camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 1);
camera.up.set( 0, 0, 0);
camera.lookAt(0, 0, 0);
camera.rotateX(  -1.6 );

scene.add(camera);

//medium.com/geekculture/making-a-3d-web-runner-game-4-making-an-infinite-plane-with-a-shader-48a0c63bc8d2
//https:codepen.io/DonKarlssonSan/pen/deVYoZ

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneWired(150,150,50,50);
scene.add(plane);

//camera position
var cameraHolder  = new THREE.Object3D();

cameraHolder.add(camera);

cameraHolder.position.set(0,20,0);

scene.add(cameraHolder);

// let cubeGeometry = new THREE.BoxGeometry(2, 0.5, 2);
// let cube = new THREE.Mesh(cubeGeometry, material);

// // position the cube
// cube.position.set(0, 10, -15.0);

// // add the cube to the scene
// scene.add(cube);


let aviao; 
aviao = new Retangulo(0.5,2);
scene.add(aviao.cube);

render();

function keyboardCamera(){

  
  keyboard.update();


  if ( keyboard.down("up") )   aviao.cube.translateZ(-1);
  if ( keyboard.down("down") ) aviao.cube.translateZ(1);

  if ( keyboard.down("right") ) aviao.cube.translateX(1);
  if ( keyboard.down("left") ) aviao.cube.translateX(-1);

  if ( keyboard.down("D") ) {aviao.cube.removeFromParent (); aviao.cube.translateX(-1);}


}

function att(){

  cameraHolder.translateZ(-0.02);
  aviao.cube.translateZ(-0.02);
 
}

function render()
{
  att();
  keyboardCamera();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

