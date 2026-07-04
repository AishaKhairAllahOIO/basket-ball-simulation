import * as THREE from "three";

import { RigidBody } from "./RigidBody.js";
import { physicsConfig } from "../config/physicsConfig.js";
import {
  degToRad,
  revolutionsToRadPerSecond,
} from "../math/physicsMath.js";

export class Basketball extends RigidBody {
  constructor() {
    super({
      mass: physicsConfig.ball.mass,
      radius: physicsConfig.ball.radius,
      inertiaFactor: physicsConfig.ball.inertiaFactor,
      position: new THREE.Vector3(2.8, 1.75, physicsConfig.launch.sideOffset),
      velocity: new THREE.Vector3(0, 0, 0),
      angularVelocity: new THREE.Vector3(0, 0, 0),
    });

    this.reset();
  }

  reset() {
    const theta = degToRad(physicsConfig.launch.angleDeg);
    const speed = physicsConfig.launch.speed;

    this.updateMassProperties({
      mass: physicsConfig.ball.mass,
      radius: physicsConfig.ball.radius,
      inertiaFactor: physicsConfig.ball.inertiaFactor,
    });

    this.position.set(2.8, 1.75, physicsConfig.launch.sideOffset);
    this.previousPosition.copy(this.position);

    this.velocity.set(
      Math.cos(theta) * speed,
      Math.sin(theta) * speed,
      physicsConfig.launch.sideVelocity
    );

    const backspin = revolutionsToRadPerSecond(physicsConfig.launch.backspin);
    const topspin = revolutionsToRadPerSecond(physicsConfig.launch.topspin);
    const sidespin = revolutionsToRadPerSecond(physicsConfig.launch.sidespin);

    this.angularVelocity.set(
      0,
      sidespin,
      topspin - backspin
    );

    this.acceleration.set(0, 0, 0);
    this.angularAcceleration.set(0, 0, 0);
    this.clearForces();

    this.hasScored = false;
    this.hasPassedAboveRim = false;
    this.touchedRim = false;
    this.touchedBackboard = false;
    this.touchedGround = false;
  }
}