import * as THREE from "three";

export function buoyancyForce({ rho, V, g }) {
  return new THREE.Vector3(0, rho * V * g, 0);
}