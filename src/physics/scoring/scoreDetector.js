import { basketballDimensions } from "../../shared/constants/dimensions.js";

export function detectScore(ball) {
  const rim = basketballDimensions.hoop;

  const dx = ball.position.x - rim.position.x;
  const dz = ball.position.z - rim.position.z;

  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

  if (ball.position.y > rim.height + ball.radius) {
    ball.hasPassedAboveRim = true;
  }

  const safeRadius = rim.radius - ball.radius;

  const crossedDown =
    ball.hasPassedAboveRim &&
    ball.position.y < rim.height &&
    ball.velocity.y < 0;

  if (crossedDown && horizontalDistance < safeRadius && !ball.hasScored) {
    ball.hasScored = true;
    return true;
  }

  return false;
}