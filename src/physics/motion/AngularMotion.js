import * as THREE from "three";

export function computeAngularAcceleration(body) {
  if (!body || body.I <= 0) {
    return new THREE.Vector3();
  }

  return body.tau.clone().divideScalar(body.I);
}

export function applyAngularMotion(body) {
  body.alpha.copy(computeAngularAcceleration(body));
}