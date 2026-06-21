import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function magnusForce(body) {
  return new THREE.Vector3()
    .crossVectors(body.angularVelocity, body.velocity)
    .multiplyScalar(physicsConfig.magnusCoefficient);
}