import * as THREE from "three";

export function computeSpringDampingForce({
  normal,
  penetrationDepth,
  normalVelocity,
  stiffness,
  damping,
}) {
  if (!normal || penetrationDepth <= 0) {
    return new THREE.Vector3();
  }

  const springForce = stiffness * penetrationDepth;
  const dampingForce = -damping * normalVelocity;

  const forceMagnitude = Math.max(0, springForce + dampingForce);

  return normal.clone().normalize().multiplyScalar(forceMagnitude);
}