import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";
import { EPSILON } from "../math/physicsMath.js";

export function detectRimCollision(body) {
  const rim = physicsConfig.hoop;

  const center = new THREE.Vector3(
    rim.x,
    rim.height,
    rim.z
  );

  const dx = body.position.x - center.x;
  const dz = body.position.z - center.z;

  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

  if (horizontalDistance < EPSILON) {
    return null;
  }

  const closestPointOnRingCenterline = new THREE.Vector3(
    center.x + (dx / horizontalDistance) * rim.rimRadius,
    center.y,
    center.z + (dz / horizontalDistance) * rim.rimRadius
  );

  const fromTubeToBall = body.position
    .clone()
    .sub(closestPointOnRingCenterline);

  const distance = fromTubeToBall.length();
  const collisionDistance = body.radius + rim.rimTubeRadius;

  if (distance >= collisionDistance) {
    return null;
  }

  const normal = fromTubeToBall.normalize();

  return {
    type: "rim",
    normal,
    penetrationDepth: collisionDistance - distance,
    contactPoint: closestPointOnRingCenterline
      .clone()
      .add(normal.clone().multiplyScalar(rim.rimTubeRadius)),
    restitution: rim.restitution,
    staticFriction: rim.staticFriction,
    kineticFriction: rim.kineticFriction,
    stiffness: rim.stiffness,
    damping: rim.damping,
  };
}