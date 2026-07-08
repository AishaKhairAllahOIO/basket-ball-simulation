import * as THREE from "three";

const EPSILON = 1e-8;

function classifyRimHit(dx, dz) 
{
  const absX = Math.abs(dx);
  const absZ = Math.abs(dz);

  if (absX >= absZ) 
  {
    return dx < 0 ? "front-rim" : "back-rim";
  }

  return dz < 0 ? "right-rim" : "left-rim";
}

export function RimContact(body, config) 
{
  const rim = config.court.hoop;

  const center = new THREE.Vector3(rim.x, rim.y, rim.z);
  const rimRadius = rim.rimInnerDiameter / 2;
  const rimTubeRadius = rim.rimMetalDiameter / 2;

  const dx = body.position.x - center.x;
  const dz = body.position.z - center.z;
  const rimHitType = classifyRimHit(dx, dz);
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

  if (horizontalDistance < EPSILON) return null;

  const closestPointOnRimCenterline = new THREE.Vector3(
    center.x + (dx / horizontalDistance) * rimRadius,
    center.y,
    center.z + (dz / horizontalDistance) * rimRadius
  );

  const fromRimToBall = body.position.clone().sub(closestPointOnRimCenterline);
  const distance = fromRimToBall.length();
  const collisionDistance = body.R + rimTubeRadius;

  if (distance >= collisionDistance) return null;

  const normal = fromRimToBall.normalize();

  return {
    type: "rim",
    rimHitType,
    normal,
    penetrationDepth: collisionDistance - distance,
    contactPoint: closestPointOnRimCenterline
      .clone()
      .add(normal.clone().multiplyScalar(rimTubeRadius)),
    stiffness: rim.stiffness,
    damping: rim.damping,
    e: config.ball.restitution.rim,
    muS: 0.45,
    muK: 0.35,
  };
}