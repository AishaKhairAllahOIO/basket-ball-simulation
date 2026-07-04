export function computeMomentum(body) {
  return {
    p: body.velocity.clone().multiplyScalar(body.mass),
    L: body.angularVelocity.clone().multiplyScalar(body.inertia),
  };
}