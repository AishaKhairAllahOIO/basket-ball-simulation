import * as THREE from "three";

export function AngularDamping(body, config) 
{
  if (!config.enabled.angularDamping) 
  {
    return new THREE.Vector3();
  }

  return body.omega
    .clone()
    .multiplyScalar(-config.ball.aerodynamics.angularDampingCoefficient);
}