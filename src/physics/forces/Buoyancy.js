import * as THREE from "three";

export function Buoyancy(body, config) {
  if (!config.enabled.buoyancy) {
    return new THREE.Vector3();
  }

  return new THREE.Vector3(
    0,
    config.environment.air.rho * config.ball.derived.V * config.environment.g,
    0
  );
}