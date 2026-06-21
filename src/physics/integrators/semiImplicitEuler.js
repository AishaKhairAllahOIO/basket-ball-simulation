export function semiImplicitEuler(body, dt) {
  body.acceleration.copy(body.force).divideScalar(body.mass);

  body.velocity.addScaledVector(body.acceleration, dt);
  body.position.addScaledVector(body.velocity, dt);

  const angularAcceleration = body.torque
    .clone()
    .divideScalar(body.inertia);

  body.angularVelocity.addScaledVector(angularAcceleration, dt);
}