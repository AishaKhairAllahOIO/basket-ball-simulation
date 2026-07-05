import * as THREE from "three";

export function computeLinearAcceleration(body) {
  if (!body || body.m <= 0) {
    return new THREE.Vector3();
  }

  return body.F.clone().divideScalar(body.m);
}

export function applyLinearMotion(body) {
  body.a.copy(computeLinearAcceleration(body));
}