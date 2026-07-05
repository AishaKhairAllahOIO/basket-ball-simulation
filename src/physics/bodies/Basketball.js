import * as THREE from "three";

import { RigidBody } from "./RigidBody.js";
import { BasketballProperties } from "../properties/BasketballProperties.js";
import { BasketballGeometry } from "../derived/BasketballGeometry.js";
import { BasketballInertia } from "../derived/BasketballInertia.js";

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function revToRadPerSecond(rev) {
  return rev * 2 * Math.PI;
}

export class Basketball extends RigidBody {
  constructor() {
    const theta = degToRad(44);
    const speed = 8.6;

    super({
      m: BasketballProperties.m,
      R: BasketballGeometry.R,
      I: BasketballInertia.I,

      position: new THREE.Vector3(2.8, 1.75, 0),

      velocity: new THREE.Vector3(
        Math.cos(theta) * speed,
        Math.sin(theta) * speed,
        0
      ),

      omega: new THREE.Vector3(
        0,
        0,
        -revToRadPerSecond(6)
      ),
    });

    this.hasScored = false;
    this.hasPassedAboveRim = false;
    this.touchedGround = false;
    this.touchedRim = false;
    this.touchedBackboard = false;
  }
}