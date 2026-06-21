import * as THREE from "three";

export function resolveCollision({
  body,
  normal,
  restitution,
  friction,
  correctionDepth = 0,
}) {
  const n = normal.clone().normalize();

  if (correctionDepth > 0) {
    body.position.addScaledVector(n, correctionDepth);
  }

  const vn = body.velocity.dot(n);

  if (vn >= 0) return;

  const normalVelocity = n.clone().multiplyScalar(vn);
  const tangentVelocity = body.velocity.clone().sub(normalVelocity);

  const reflectedNormal = normalVelocity.multiplyScalar(-restitution);
  const reducedTangent = tangentVelocity.multiplyScalar(1 - friction);

  body.velocity.copy(reflectedNormal.add(reducedTangent));

  const torqueImpulse = new THREE.Vector3()
    .crossVectors(
      n.clone().multiplyScalar(-body.radius),
      reducedTangent.clone().multiplyScalar(body.mass)
    );

  body.angularVelocity.addScaledVector(torqueImpulse, 1 / body.inertia);
}