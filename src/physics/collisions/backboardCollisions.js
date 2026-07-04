import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function detectBackboardCollision(body) {
  const board = physicsConfig.backboard;

  const normal = new THREE.Vector3(
    board.normalDirection,
    0,
    0
  ).normalize();

  const signedDistance =
    (body.position.x - board.x) * board.normalDirection;

  if (signedDistance >= body.radius) {
    return null;
  }

  const withinHeight =
    body.position.y >= board.y - board.height / 2 - body.radius &&
    body.position.y <= board.y + board.height / 2 + body.radius;

  const withinWidth =
    body.position.z >= board.z - board.width / 2 - body.radius &&
    body.position.z <= board.z + board.width / 2 + body.radius;

  if (!withinHeight || !withinWidth) {
    return null;
  }

  return {
    type: "backboard",
    normal,
    penetrationDepth: body.radius - signedDistance,
    contactPoint: new THREE.Vector3(
      board.x,
      body.position.y,
      body.position.z
    ),
    restitution: board.restitution,
    staticFriction: board.staticFriction,
    kineticFriction: board.kineticFriction,
    stiffness: board.stiffness,
    damping: board.damping,
  };
}