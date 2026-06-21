import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function buoyancyForce(body) {
  const volume = (4 / 3) * Math.PI * Math.pow(body.radius, 3);

  const magnitude =
    physicsConfig.airDensity * volume * physicsConfig.gravity;

  return new THREE.Vector3(0, magnitude, 0);
}