import { physicsConfig } from "../config/physicsConfig.js";

export function computeEnergy(body) {
  const translationalKinetic =
    0.5 * body.mass * body.velocity.lengthSq();

  const rotationalKinetic =
    0.5 * body.inertia * body.angularVelocity.lengthSq();

  const potential =
    body.mass * physicsConfig.environment.gravity * body.position.y;

  const total =
    translationalKinetic + rotationalKinetic + potential;

  return {
    Kt: translationalKinetic,
    Kr: rotationalKinetic,
    U: potential,
    E: total,
  };
}