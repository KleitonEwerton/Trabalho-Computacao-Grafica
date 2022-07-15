import * as THREE from "three";
import { Projeteis } from "./projeteis.js";
import { loader } from "./controllers.js";
import { scene, removeFromScene } from "./main.js";

const geometry = new THREE.BoxGeometry(0.8, 0.8, 2.5);
let material = new THREE.MeshLambertMaterial();

/*

  sub classe de projeteis, é enviada para baixo e depois para frente na altura do avião que o disparou divido por dois

*/
export class LandMissileEnemy extends Projeteis {
  constructor(posx, posy, posz, isEnemy, vectorPlayer) {
    super(posx, posy, posz, false, vectorPlayer, geometry, material);
    scene.remove(this.shot);
    this.angleToUpper = 90;
    this.chegouAoTop = false;
    this.enemy = isEnemy;
    this.damage = 2;

    const afterload = (object) => {
      this.obj = object;
      scene.add(this.obj);
    };

    function loaderObject3D(PATH) {
      loader.load(PATH, function (object) {
        object.scene.position.set(posx, posy, posz);
        object.scene.scale.set(0.2, 0.2, 0.2);
        object.scene.rotateX(90 * (Math.PI / 180));

        afterload(object.scene);
      });
    }
    loaderObject3D("./assets/missil/scene.gltf");
  }

  move(qntMove, vectorPlayer, limiteY = 10) {
    if (this.obj != undefined) {
      if (this.vectorPosition.y + qntMove < limiteY)
        this.shot.translateZ(qntMove);
      else {
        if (!this.chegouAoTop) {
          this.shot.rotateX(this.angleToUpper * (Math.PI / 180));
          this.shot.lookAt(vectorPlayer);
          this.obj.lookAt(vectorPlayer);
          this.obj.rotateX(-180 * (Math.PI / 180));
        }
        this.chegouAoTop = true;
        this.shot.translateZ(qntMove);
      }

      this.obj.position.lerp(this.vectorPosition, 1);
      if (this.chegouAoTop) this.obj.position.y = 12;
    }
  }
  rotateX() {
    this.shot.rotateX(-this.angleToUpper * (Math.PI / 180));
  }

  removed(time = 0) {
    removeFromScene(this.shot, time * 1000);
    removeFromScene(this.obj, time * 1000);
  }
}
