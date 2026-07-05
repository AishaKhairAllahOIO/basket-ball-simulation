import * as THREE from "three";

const EPSILON = 1e-8;

export function MagnusEffect(body, config) {
  if (!config.enabled.magnus) {
    return new THREE.Vector3();
  }

  const S = config.ball.aerodynamics.magnusCoefficient;

  const omegaCrossVelocity = body.omega.clone().cross(body.v);

  if (omegaCrossVelocity.lengthSq() < EPSILON) {
    return new THREE.Vector3();
  }

  return omegaCrossVelocity.multiplyScalar(S);
}