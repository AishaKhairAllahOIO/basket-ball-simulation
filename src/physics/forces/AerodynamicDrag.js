import * as THREE from "three";

const EPSILON = 1e-8;

export function AerodynamicDrag(body, config) 
{
  if (!config.enabled.drag) 
  {
    return new THREE.Vector3();
  }

  const wind = new THREE.Vector3(
    config.environment.air.wind.x,
    config.environment.air.wind.y,
    config.environment.air.wind.z
  );

  const vRelative = body.v.clone().sub(wind);
  const speed = vRelative.length();

  if (speed < EPSILON) 
  {
    return new THREE.Vector3();
  }

  const rho = config.environment.air.rho;
  const Cd = config.ball.aerodynamics.Cd;
  const A = config.ball.geometry.A;

  return vRelative
    .clone()
    .normalize()
    .multiplyScalar(-0.5 * rho * Cd * A * speed * speed);
}