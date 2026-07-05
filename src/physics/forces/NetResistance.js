import * as THREE from "three";

export function NetResistance(body, config) {
  if (!config.enabled.netResistance) {
    return new THREE.Vector3();
  }

  return body.v
    .clone()
    .multiplyScalar(-config.court.net.dampingCoefficient);
}