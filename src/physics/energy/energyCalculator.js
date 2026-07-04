import { physicsConfig } from "../config/physicsConfig.js";

export function calculateKineticEnergy(body)
{
  return 0.5 * body.mass * body.velocity.lengthSq();
}

export function calculateRotationalEnergy(body) 
{
  return 0.5 * body.inertia * body.angularVelocity.lengthSq();
}

export function calculatePotentialEnergy(body)
{
  return body.mass * physicsConfig.gravity * body.position.y;
}

export function calculateTotalEnergy(body) 
{
  return (
    calculateKineticEnergy(body) +
    calculateRotationalEnergy(body) +
    calculatePotentialEnergy(body)
  );
}