import * as THREE from "three";

export function safeNormalize(vector, fallback = new THREE.Vector3(0, 1, 0)) {
  if (vector.lengthSq() < 0.000001) {
    return fallback.clone();
  }

  return vector.clone().normalize();
}

export function projectOnPlane(vector, normal) {
  const n = normal.clone().normalize();
  return vector.clone().sub(n.multiplyScalar(vector.dot(n)));
}

export function getVectorMagnitude(vector) {
  return vector.length();
}