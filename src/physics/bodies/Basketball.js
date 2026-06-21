import * as THREE from "three";
import { RigidBody } from "./RigidBody.js";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

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
    this.position.set(-3.2, 1.7, 0);
    this.velocity.set(7.2, 6.2, 0);
    this.angularVelocity.set(0, 0, -35);
    this.hasScored = false;
    this.hasPassedAboveRim = false;
    this.touchedRim = false;
    this.touchedBackboard = false;
  }
}