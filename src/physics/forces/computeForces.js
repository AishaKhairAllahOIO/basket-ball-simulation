import * as THREE from "three";
import { physicsConfig } from "../config/physicsConfig.js";

export function computeForces(ball) {
  ball.clearForces();

  const gravity = new THREE.Vector3(
    0,
    -ball.mass * physicsConfig.gravity,
    0
  );

  ball.addForce(gravity);

  const speed = ball.velocity.length();

  if (speed > 0.0001) {
    const drag = ball.velocity
      .clone()
      .normalize()
      .multiplyScalar(
        -0.5 *
          physicsConfig.airDensity *
          physicsConfig.dragCoefficient *
          Math.PI *
          ball.radius *
          ball.radius *
          speed *
          speed
      );

    ball.addForce(drag);
  }

  const magnus = new THREE.Vector3()
    .crossVectors(ball.angularVelocity, ball.velocity)
    .multiplyScalar(physicsConfig.magnusCoefficient);

  ball.addForce(magnus);

  const angularDrag = ball.angularVelocity
    .clone()
    .multiplyScalar(-0.002);

  ball.addTorque(angularDrag);
}