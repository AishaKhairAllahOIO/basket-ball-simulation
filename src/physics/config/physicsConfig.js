import * as THREE from "three";

export const EPSILON = 1e-8;

export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

export function revolutionsToRadPerSecond(revolutionsPerSecond) {
  return revolutionsPerSecond * 2 * Math.PI;
}

export function computeCrossSectionArea(R) {
  return Math.PI * R * R;
}

export function computeSphereVolume(R) {
  return (4 / 3) * Math.PI * R ** 3;
}

export function computeInertia(lambda, m, R) {
  return lambda * m * R * R;
}

export function clampVectorLength(vector, maxLength) {
  if (vector.length() > maxLength) {
    vector.setLength(maxLength);
  }

  return vector;
}

export function projectOnNormal(vector, normal) {
  const n = normal.clone().normalize();
  return n.multiplyScalar(vector.dot(n));
}

export function getTangentialComponent(vector, normal) {
  return vector.clone().sub(projectOnNormal(vector, normal));
}

export function zeroVector() {
  return new THREE.Vector3(0, 0, 0);
}