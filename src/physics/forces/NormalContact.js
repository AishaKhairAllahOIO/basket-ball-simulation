import * as THREE from "three";

export function NormalForce(body, contact) {
  if (!contact || contact.penetrationDepth <= 0) {
    return new THREE.Vector3();
  }

  const n = contact.normal.clone().normalize();
  const vn = body.v.dot(n);

  const magnitude = Math.max(
    0,
    contact.stiffness * contact.penetrationDepth - contact.damping * vn
  );

  return n.multiplyScalar(magnitude);
}