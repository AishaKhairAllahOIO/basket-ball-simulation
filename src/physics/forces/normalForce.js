import * as THREE from "three";

export function normalForce({
  normal,
  penetrationDepth,
  normalVelocity,
  stiffness,
  damping,
}) {
  if (penetrationDepth <= 0) {
    return new THREE.Vector3();
  }

  const n = normal.clone().normalize();

  const FnMagnitude = Math.max(
    0,
    stiffness * penetrationDepth - damping * normalVelocity
  );

  return n.multiplyScalar(FnMagnitude);
}