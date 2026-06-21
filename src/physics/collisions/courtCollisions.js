import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";
import { resolveCollision } from "./collisionResponse.js";

export function handleGroundCollision(ball) {
  const groundY = ball.radius;

  if (ball.position.y < groundY) {
    const penetration = groundY - ball.position.y;

    resolveCollision({
      body: ball,
      normal: new THREE.Vector3(0, 1, 0),
      restitution: physicsConfig.restitution.ground,
      friction: physicsConfig.friction.kinetic,
      correctionDepth: penetration,
    });
  }
}