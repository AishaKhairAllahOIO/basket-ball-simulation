export function ScoreDetector(body, config) {
  const rim = config.court.hoop;

  const rimRadius = rim.rimInnerDiameter / 2;
  const safeRadius = rimRadius - body.R;

  const dx = body.position.x - rim.x;
  const dz = body.position.z - rim.z;

  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

  if (body.position.y > rim.y + body.R) {
    body.hasPassedAboveRim = true;
  }

  const crossedDown =
    body.previousPosition.y >= rim.y &&
    body.position.y < rim.y &&
    body.v.y < 0;

  if (
    body.hasPassedAboveRim &&
    crossedDown &&
    horizontalDistance < safeRadius
  ) {
    body.hasScored = true;
  }

  return {
    hasScored: body.hasScored,
  };
}