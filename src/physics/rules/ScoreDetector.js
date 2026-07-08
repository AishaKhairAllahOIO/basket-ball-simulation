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

  const isInsideSafeOpening = horizontalDistance < safeRadius;

  const hasScored =
    body.hasPassedAboveRim &&
    crossedDown &&
    isInsideSafeOpening;

  if (hasScored) {
    body.hasScored = true;

    if (!body.touchedRim && !body.touchedBackboard) {
      body.scoreType = "swish";
    } else if (body.touchedBackboard) {
      body.scoreType = "score-after-backboard";
    } else if (body.lastRimHitType === "front-rim") {
      body.scoreType = "score-after-front-rim";
    } else if (body.lastRimHitType === "back-rim") {
      body.scoreType = "score-after-back-rim";
    } else if (
      body.lastRimHitType === "left-rim" ||
      body.lastRimHitType === "right-rim"
    ) {
      body.scoreType = "score-after-side-rim";
    } else {
      body.scoreType = "score-after-contact";
    }
  }

  if (!body.hasScored) {
    if (body.position.y < rim.y && horizontalDistance > rimRadius + body.R) {
      body.outcomeType = "miss-outside-rim";
    }

    if (body.touchedRim && body.v.y > 0) {
      body.outcomeType = "miss-bounced-out";
    }

    if (body.touchedBackboard && !body.touchedRim && body.position.y < rim.y) {
      body.outcomeType = "miss-after-backboard";
    }

    if (
      body.lastRimHitType === "front-rim" &&
      body.position.x < rim.x &&
      body.position.y < rim.y
    ) {
      body.outcomeType = "miss-after-front-rim";
    }

    if (
      body.lastRimHitType === "back-rim" &&
      body.position.x > rim.x &&
      body.position.y < rim.y
    ) {
      body.outcomeType = "miss-after-back-rim";
    }

    if (
      (body.lastRimHitType === "left-rim" ||
        body.lastRimHitType === "right-rim") &&
      Math.abs(body.position.z - rim.z) > rimRadius
    ) {
      body.outcomeType = "miss-side-rim";
    }
  }

  return {
    hasScored: body.hasScored,
    scoreType: body.scoreType ?? null,
    outcomeType: body.outcomeType ?? null,
  };
}