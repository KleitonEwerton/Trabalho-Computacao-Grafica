import * as THREE from "three";
import { CSG } from "../libs/other/CSGMesh.js";

let csgCruz, boxVertCSG, boxHorzCSG; //cruz
let csgCylinder, boxCylinderCSG; //cilindro
let boxVertical, boxHorizontal, cylinderMesh; //objetos

export class Recharge {
    constructor(posx, posy, posz, scene) {

        //criando os objetos
        boxVertical = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 2.5));
        boxVertical.position.set(0, 0, -5);

        boxHorizontal = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 2.5));
        boxHorizontal.position.set(0, 0, -5);
        boxHorizontal.rotateY(Math.PI / 2); //formato de cruz

        //criando o cilindro achatado
        cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0, 20));
        cylinderMesh.position.set(0, 0, -5);

        //Metodo CSG
        updateObject(boxVertical);
        updateObject(boxHorizontal);
        updateObject(cylinderMesh);

        boxVertCSG = CSG.fromMesh(boxVertical);
        boxHorzCSG = CSG.fromMesh(boxHorizontal);
        boxCylinderCSG = CSG.fromMesh(cylinderMesh);

        csgCruz = boxVertCSG.union(boxHorzCSG); //uniao = cruz
        csgCylinder = boxCylinderCSG.subtract(csgCruz); //subtracao = cilindro com a cruz

        //criando o objeto final
        this.recargaObject = CSG.toMesh(csgCylinder, new THREE.Matrix4());
        this.recargaObject.material = new THREE.MeshLambertMaterial({ color: 'rgb(255, 20, 20)' });
        this.recargaObject.position.set(posx, posy, posz);
        this.recargaObject.castShadow = true;
        scene.add(this.recargaObject);

        function updateObject(mesh) {
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
        }

        this.vectorPosition = new THREE.Vector3();
        this.vectorPosition.copy(this.recargaObject.position);
    }

    recargaObject() {
        return this.recargaObject;
    }


}