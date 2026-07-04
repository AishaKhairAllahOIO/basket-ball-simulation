import { physicsConfig } from "../config/physicsConfig.js";

export function updateScoringState(body) {
  const rim = physicsConfig.hoop;

  const dx = body.position.x - rim.x;
  const dz = body.position.z - rim.z;

  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const safeRadius = rim.rimRadius - body.radius;

  if (body.position.y > rim.height + body.radius) {
    body.hasPassedAboveRim = true;
  }

  const crossedRimPlaneDownward =
    body.previousPosition.y >= rim.height &&
    body.position.y < rim.height &&
    body.velocity.y < 0;

  const centerInsideSafeCircle =
    horizontalDistance < safeRadius;

  if (
    body.hasPassedAboveRim &&
    crossedRimPlaneDownward &&
    centerInsideSafeCircle
  ) {
    body.hasScored = true;
  }

  return {
    hasScored: body.hasScored,
    hasPassedAboveRim: body.hasPassedAboveRim,
    touchedRim: body.touchedRim,
    touchedBackboard: body.touchedBackboard,
    type: body.hasScored
      ? body.touchedRim
        ? "score-after-rim"
        : body.touchedBackboard
          ? "score-after-backboard"
          : "swish"
      : "no-score-yet",
  };
}