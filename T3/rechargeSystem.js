import { Recharge } from "./recharge.js";
import { player, cameraHolder, detectCollisionCubes, removeFromScene } from "./main.js";
import { scene, maxDistanceShot, posInitPlayerY } from "./controllers.js";
import {recoverySphere } from "./lifeSystem.js";

let rechargeList = [];

function createRechargeCSG(posx) {
    rechargeList.push(
      new Recharge(
        posx, //valor da coordenada x. minimo: -60 maximo 60
        posInitPlayerY,
        cameraHolder.position.z - maxDistanceShot, //Gera um z para distância inicial do inimigo. Distância minima: distância maxima do tir,  maxima:  distância maxima do tiro + 10
        scene
      )
    );
  
}

function rechargeBattery() {
  for (var i = 0; i < rechargeList.length; i++)
    if (detectCollisionCubes(player.airplane, rechargeList[i].recargaObject)) {
      removeFromScene(rechargeList[i].recargaObject, 0); //Remove da cena
      removeFromScene(rechargeList[i].obj, 0); //Remove da cena
      rechargeList.splice(i, 1);

      if (player.getLife() < 5) {
        player.extraLife();
        recoverySphere();
      }

      return;
    }
}

export { rechargeBattery, createRechargeCSG };
