import * as THREE from "three";

export function Gravity(body, config) {
  if (!config.enabled.gravity) {
    return new THREE.Vector3();
  }

  return new THREE.Vector3(0, -body.m * config.environment.g, 0);
}