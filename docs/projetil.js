import * as THREE from  'three';
import { initBasicMaterial } from "../libs/util/util.js";

export class Projetil{

    constructor(){
        let material = initBasicMaterial(); 

        let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.cube = new THREE.Mesh(cubeGeometry, material);
        this.cube.position.set(0,0,0);
    }

    Projetil(){
        return this.cube;
    }
    moving(){
        this.cube.translateZ(-10);
    }
}