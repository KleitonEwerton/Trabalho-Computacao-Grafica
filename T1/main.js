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

import {Retangulo} from './aviao.js';
     


let keyboard = new KeyboardState();

let scene, renderer, camera,  plane, plane2; // variables 
scene = new THREE.Scene();                    // Create main scene
renderer = initRenderer();    // Init a basic renderer

scene.add(new THREE.HemisphereLight());

camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 1);
camera.up.set( 0, 0, 0);
camera.lookAt(0, 0, 0);
camera.rotateX(  -1.6 );

scene.add(camera);
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//medium.com/geekculture/making-a-3d-web-runner-game-4-making-an-infinite-plane-with-a-shader-48a0c63bc8d2
//https:codepen.io/DonKarlssonSan/pen/deVYoZ

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

// create the ground plane
plane = createGroundPlaneWired(200,200,50,50);
scene.add(plane);
plane2 = createGroundPlaneWired(200,200,50,50);
scene.add(plane2);

let posZPlane1 = 0;
let posZPlane2 = -200;

plane.position.z = posZPlane1;
plane2.position.z = posZPlane2;

//camera position
var cameraHolder  = new THREE.Object3D();

cameraHolder.add(camera);

cameraHolder.position.set(0,20,0);

scene.add(cameraHolder);


let aviao; 
aviao = new Retangulo(0.5,2, 0,0,-20);
scene.add(aviao.cube);

let aviao2; 
aviao2 = new Retangulo(0.5,2, 0,0,-30);
scene.add(aviao2.cube);

//Configurações de controle do plano
let fatorLimite = -200;
let limitador = fatorLimite;
let controle = 0;

render();

function keyboardCamera(){

  
  keyboard.update();

  

  if ( keyboard.pressed("up") ) aviao.cube.position.lerp(new THREE.Vector3(0.0, 0.0, 0.0), -0.001);



}

function att(){

  
  cameraHolder.translateZ(-0.9);

  console.log(cameraHolder.position.z, plane.position.z, plane2.position.z, limitador);

  renderInfPlane();

}

function renderInfPlane(){
  if(cameraHolder.position.z < limitador){

    if(controle % 2 == 0){

      limitador += -200;
      plane.position.z = limitador;
  

    }else{
      limitador += -200;  
      plane2.position.z = limitador;
    }
    controle += 1;
  }
}

function render()
{
  att();
  keyboardCamera();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

