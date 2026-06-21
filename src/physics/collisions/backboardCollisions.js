import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";
import { physicsConfig } from "../config/physicsConfig.js";
import { resolveCollision } from "./collisionResponse.js";

export function handleBackboardCollision(ball) {
  const board = basketballDimensions.backboard;

  const boardX = board.position.x - board.depth / 2;
  const withinY =
    ball.position.y > board.position.y - board.height / 2 &&
    ball.position.y < board.position.y + board.height / 2;

  const withinZ =
    Math.abs(ball.position.z - board.position.z) < board.width / 2;

  if (
    withinY &&
    withinZ &&
    ball.position.x + ball.radius > boardX &&
    ball.position.x < board.position.x
  ) {
    ball.touchedBackboard = true;

    const penetration = ball.position.x + ball.radius - boardX;

    resolveCollision({
      body: ball,
      normal: new THREE.Vector3(-1, 0, 0),
      restitution: physicsConfig.restitution.backboard,
      friction: 0.25,
      correctionDepth: penetration,
    });
  }
}