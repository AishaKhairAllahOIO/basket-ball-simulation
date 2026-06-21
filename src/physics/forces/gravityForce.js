import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function gravityForce(body) {
  return new THREE.Vector3(0, -body.mass * physicsConfig.gravity, 0);
}