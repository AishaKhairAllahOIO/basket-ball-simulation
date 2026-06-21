import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function dragForce(body) {
  const speed = body.velocity.length();

  if (speed < 0.000001) {
    return new THREE.Vector3(0, 0, 0);
  }

  const area = Math.PI * body.radius * body.radius;

  const magnitude =
    0.5 *
    physicsConfig.airDensity *
    physicsConfig.dragCoefficient *
    area *
    speed *
    speed;

  return body.velocity.clone().normalize().multiplyScalar(-magnitude);
}