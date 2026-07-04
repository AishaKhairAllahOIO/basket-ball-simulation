import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function detectGroundCollision(body) {
  const ground = physicsConfig.ground;

  const bottomY = body.position.y - body.radius;

  if (bottomY >= ground.y) {
    return null;
  }

  const penetrationDepth = ground.y - bottomY;

  return {
    type: "ground",
    normal: new THREE.Vector3(0, 1, 0),
    penetrationDepth,
    contactPoint: new THREE.Vector3(
      body.position.x,
      ground.y,
      body.position.z
    ),
    restitution: ground.restitution,
    staticFriction: ground.staticFriction,
    kineticFriction: ground.kineticFriction,
    stiffness: ground.stiffness,
    damping: ground.damping,
  };
}