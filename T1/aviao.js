import * as THREE from  'three';
import { initBasicMaterial } from "../libs/util/util.js";

export class Retangulo {

    constructor(altura, largura, posx, posy, posz) {
  
      let material = initBasicMaterial(); 
      this.altura = altura;
      this.largura = largura;
      
  
      let cubeGeometry = new THREE.BoxGeometry(largura, altura, largura);
      this.cube = new THREE.Mesh(cubeGeometry, material);
      this.cube.position.set(posx,posy,posz);
  
    }
    cube(){
     return this.cube();
    }
  
    moveInX(qntMove){
      this.cube.translateX(qntMove);

    }

    moveInY(qntMove){
      this.cube.translateY(qntMove);

    }
    moveInZ(qntMove){
      this.cube.translateZ(qntMove);
    }
    
  
  }  