import * as THREE from "three";

export function RollingResistance(body, rollingCoefficient = 0.02) 
{
  const speed = body.v.length();

  if (speed < 1e-5) 
  {
    return new THREE.Vector3();
  }

  return body.v.clone().normalize().multiplyScalar(-rollingCoefficient * body.m * 9.81);
}