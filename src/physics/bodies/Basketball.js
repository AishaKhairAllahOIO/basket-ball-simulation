import * as THREE from "three";
import { RigidBody } from "./RigidBody.js";
import { basketballDimensions } from "../../shared/constants/dimensions.js";
import { physicsConfig } from "../config/physicsConfig.js";

export class Basketball extends RigidBody {
  constructor() {
    super({
      mass: basketballDimensions.ball.mass,
      radius: basketballDimensions.ball.radius,
      position: new THREE.Vector3(-3.2, 1.7, 0),
      velocity: new THREE.Vector3(7.2, 6.2, 0),
      angularVelocity: new THREE.Vector3(0, 0, -35),
    });

    this.hasScored = false;
    this.hasPassedAboveRim = false;
    this.touchedRim = false;
    this.touchedBackboard = false;
  }

 reset() {
  const angle = physicsConfig.launch.angleDeg * Math.PI / 180;
  const speed = physicsConfig.launch.speed;

  this.mass = physicsConfig.ball.mass;
  this.radius = physicsConfig.ball.radius;
  this.inertia =
    physicsConfig.ball.inertiaFactor *
    this.mass *
    this.radius *
    this.radius;

  this.position.set(-3.2, 1.7, physicsConfig.launch.sideOffset);

  this.velocity.set(
    Math.cos(angle) * speed,
    Math.sin(angle) * speed,
    0
  );

  const backspin = physicsConfig.launch.backspin * Math.PI * 2;
  const sidespin = physicsConfig.launch.sidespin * Math.PI * 2;

  this.angularVelocity.set(0, sidespin, -backspin);

  this.hasScored = false;
  this.hasPassedAboveRim = false;
  this.touchedRim = false;
  this.touchedBackboard = false;
}
}