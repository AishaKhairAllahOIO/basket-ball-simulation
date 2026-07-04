import * as THREE from "three";
import { computeInertia } from "../math/physicsMath.js";

export class RigidBody {
  constructor({
    mass,
    radius,
    inertiaFactor,
    position,
    velocity,
    angularVelocity,
  }) {
    this.mass = mass;
    this.radius = radius;
    this.inertiaFactor = inertiaFactor;

    this.position = position.clone();
    this.previousPosition = position.clone();

    this.velocity = velocity.clone();
    this.acceleration = new THREE.Vector3();

    this.angularVelocity = angularVelocity.clone();
    this.angularAcceleration = new THREE.Vector3();

    this.force = new THREE.Vector3();
    this.torque = new THREE.Vector3();

    this.inertia = computeInertia(
      this.inertiaFactor,
      this.mass,
      this.radius
    );
  }

  updateMassProperties({ mass, radius, inertiaFactor }) {
    this.mass = mass;
    this.radius = radius;
    this.inertiaFactor = inertiaFactor;

    this.inertia = computeInertia(
      this.inertiaFactor,
      this.mass,
      this.radius
    );
  }

  clearForces() {
    this.force.set(0, 0, 0);
    this.torque.set(0, 0, 0);
  }

  addForce(F) {
    this.force.add(F);
  }

  addTorque(tau) {
    this.torque.add(tau);
  }
}