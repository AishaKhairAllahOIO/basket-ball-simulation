import * as THREE from "three";

export function gravityForce(body, g) {
  return new THREE.Vector3(0, -body.mass * g, 0);
}