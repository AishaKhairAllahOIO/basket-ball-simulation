import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";
import { physicsConfig } from "../config/physicsConfig.js";
import { resolveCollision } from "./collisionResponse.js";

export function handleRimCollision(ball) {
  const rim = basketballDimensions.hoop;

  const center = new THREE.Vector3(
    rim.position.x,
    rim.position.y,
    rim.position.z
  );

  const ballXZ = new THREE.Vector2(ball.position.x, ball.position.z);
  const rimXZ = new THREE.Vector2(center.x, center.z);

  const dirXZ = ballXZ.clone().sub(rimXZ);

  if (dirXZ.lengthSq() === 0) return;

  dirXZ.normalize();

  const closestPoint = new THREE.Vector3(
    center.x + dirXZ.x * rim.radius,
    center.y,
    center.z + dirXZ.y * rim.radius
  );

  const distance = ball.position.distanceTo(closestPoint);
  const minDistance = ball.radius + rim.tubeRadius;

  if (distance < minDistance) {
    ball.touchedRim = true;

    const normal = ball.position.clone().sub(closestPoint).normalize();
    const penetration = minDistance - distance;

    resolveCollision({
      body: ball,
      normal,
      restitution: physicsConfig.restitution.rim,
      friction: 0.35,
      correctionDepth: penetration,
    });
  }
}