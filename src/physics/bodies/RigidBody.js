import * as THREE from "three";

export class RigidBody {
  constructor({ mass, radius, position, velocity, angularVelocity }) {
    this.mass = mass;
    this.radius = radius;

    this.position = position.clone();
    this.velocity = velocity.clone();
    this.acceleration = new THREE.Vector3();

    this.angularVelocity = angularVelocity.clone();

    this.inertia = (2 / 3) * mass * radius * radius;

    this.force = new THREE.Vector3();
    this.torque = new THREE.Vector3();
  }

  clearForces() {
    this.force.set(0, 0, 0);
    this.torque.set(0, 0, 0);
  }

  addForce(force) {
    this.force.add(force);
  }

  addTorque(torque) {
    this.torque.add(torque);
  }
}