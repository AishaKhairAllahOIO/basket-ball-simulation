import * as THREE from "three";
import { EPSILON } from "../math/physicsMath.js";

export function dragForce({ body, rho, Cd, A, wind }) {
  const windVelocity = new THREE.Vector3(wind.x, wind.y, wind.z);
  const vRelative = body.velocity.clone().sub(windVelocity);

  const speed = vRelative.length();

  if (speed < EPSILON) {
    return new THREE.Vector3();
  }

  return vRelative
    .clone()
    .normalize()
    .multiplyScalar(-0.5 * rho * Cd * A * speed * speed);
}