import { physicsConfig } from "../config/physicsConfig.js";
import { clampVectorLength } from "../math/physicsMath.js";

export function semiImplicitEuler(body, dt) {
  body.previousPosition.copy(body.position);

  body.velocity.add(
    body.acceleration.clone().multiplyScalar(dt)
  );

  clampVectorLength(
    body.velocity,
    physicsConfig.integrator.maxVelocity
  );

  body.position.add(
    body.velocity.clone().multiplyScalar(dt)
  );

  body.angularVelocity.add(
    body.angularAcceleration.clone().multiplyScalar(dt)
  );
}