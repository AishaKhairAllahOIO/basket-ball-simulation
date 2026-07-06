import * as THREE from "three";

const EPSILON = 1e-8;

export function MagnusEffect(body, config) {
  if (!config.enabled.magnus) {
    return new THREE.Vector3();
  }

  const omegaCrossVelocity = body.omega.clone().cross(body.v);

  if (omegaCrossVelocity.lengthSq() < EPSILON) {
    return new THREE.Vector3();
  }

  /*
    =====================================================
    OPTION 1 — Full aerodynamic Magnus model
    FM = 0.5 * rho * Cl * A * |v|^2 * n
    n  = (omega × v) / |omega × v|
    =====================================================
  */

  const rho = config.environment.air.rho;
  const Cl = config.ball.aerodynamics.Cl;
  const A = config.ball.geometry.A;
  const speed = body.v.length();

  const direction = omegaCrossVelocity.clone().normalize();

  return direction.multiplyScalar(
    0.5 * rho * Cl * A * speed * speed
  );

  /*
    =====================================================
    OPTION 2 — Simplified Magnus model
    FM = S * (omega × v)
    =====================================================
  */

  // const S = config.ball.aerodynamics.magnusCoefficient;
  // return omegaCrossVelocity.multiplyScalar(S);
}