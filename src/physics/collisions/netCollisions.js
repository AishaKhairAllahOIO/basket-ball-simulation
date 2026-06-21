import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

export function handleNetCollision(ball) {
  const rim = basketballDimensions.hoop.position;

  const dx = ball.position.x - rim.x;
  const dz = ball.position.z - rim.z;

  const horizontalDistance =
    Math.sqrt(dx * dx + dz * dz);

  const insideCylinder =
    horizontalDistance <
    basketballDimensions.hoop.radius;

  const insideVerticalRange =
    ball.position.y <
      basketballDimensions.hoop.height &&
    ball.position.y >
      basketballDimensions.hoop.height - 0.45;

  if (
    insideCylinder &&
    insideVerticalRange
  ) {
    ball.velocity.multiplyScalar(0.992);
  }
}