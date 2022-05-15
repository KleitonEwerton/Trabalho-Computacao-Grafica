import * as THREE from  'three';
import { initBasicMaterial } from "../libs/util/util.js";

export class Retangulo {

    constructor(altura, largura, posx, posy, posz) {
  
      let material = initBasicMaterial(); 
      this.altura = altura;
      this.largura = largura;
      

  
      let cubeGeometry = new THREE.BoxGeometry(largura, altura, largura);
      this.cube = new THREE.Mesh(cubeGeometry, material);
      this.cube.position.set(posx, posy, posz);

      this.vectorPosition = new THREE.Vector3();
      this.vectorPosition.copy(this.cube.position);
  
    }
    cube(){
     return this.cube();
    }
  
    moveInX(qntMove, alpha) {
      this.vectorPosition.x += qntMove;
      this.cube.position.lerp(this.vectorPosition, alpha);

    }

    moveInY(qntMove, alpha){
      this.vectorPosition.y += qntMove;
      this.cube.position.lerp(this.vectorPosition, alpha);


    }
    moveInZ(qntMove, alpha){
      this.vectorPosition.z += qntMove;
      this.cube.position.lerp(this.vectorPosition, alpha);
    }
    
    getVectorPosition(){
      return this.vectorPosition;
    }
  
  }  