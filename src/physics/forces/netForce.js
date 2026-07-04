import * as THREE from "three";

export function netForce({ body, dampingCoefficient }) {
  return body.velocity
    .clone()
    .multiplyScalar(-dampingCoefficient);
}