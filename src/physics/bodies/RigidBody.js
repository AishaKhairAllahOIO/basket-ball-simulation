import * as THREE from "three";

export class RigidBody {
  constructor({ m, R, I, position, velocity, omega }) {
    this.m = m;
    this.R = R;
    this.I = I;

    this.position = position.clone();
    this.previousPosition = position.clone();

    this.v = velocity.clone();
    this.a = new THREE.Vector3();

    this.omega = omega.clone();
    this.alpha = new THREE.Vector3();

    this.F = new THREE.Vector3();
    this.tau = new THREE.Vector3();
  }

  clearForces() {
    this.F.set(0, 0, 0);
    this.tau.set(0, 0, 0);
  }

  addForce(F) {
    this.F.add(F);
  }

  addTorque(tau) {
    this.tau.add(tau);
  }
}