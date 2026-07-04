import * as THREE from "three";

export function angularDampingTorque({ body, coefficient }) {
  if (coefficient <= 0) {
    return new THREE.Vector3();
  }

  return body.angularVelocity
    .clone()
    .multiplyScalar(-coefficient);
}