import * as THREE from "three";
import { EPSILON } from "../math/physicsMath.js";

export function magnusForce({ body, magnusCoefficient }) {
  const omegaCrossVelocity = body.angularVelocity
    .clone()
    .cross(body.velocity);

  if (omegaCrossVelocity.lengthSq() < EPSILON) {
    return new THREE.Vector3();
  }

  return omegaCrossVelocity.multiplyScalar(magnusCoefficient);
}