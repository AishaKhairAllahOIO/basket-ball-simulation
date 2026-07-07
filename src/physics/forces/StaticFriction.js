import * as THREE from "three";

import { getContactPointVelocity } from "./KineticFriction.js";

const EPSILON = 1e-8;

export function StaticFriction(body, contact, normalForceMagnitude, dt) {
  if (!contact || normalForceMagnitude <= 0 || dt <= 0) {
    return {
      Ff: new THREE.Vector3(),
      tau: new THREE.Vector3(),
      mode: "no-static-friction",
      canApplyStatic: true,
    };
  }

  const n = contact.normal.clone().normalize();

  const vContact = getContactPointVelocity(body, contact.contactPoint);

  const vNormal = n.clone().multiplyScalar(vContact.dot(n));
  const vTangential = vContact.clone().sub(vNormal);

  if (vTangential.lengthSq() < EPSILON) {
    return {
      Ff: new THREE.Vector3(),
      tau: new THREE.Vector3(),
      mode: "already-no-slip",
      canApplyStatic: true,
    };
  }

  const tangentDirection = vTangential.clone().normalize();

  const r = contact.contactPoint.clone().sub(body.position);

  const rotationalTerm =
    r.clone().cross(tangentDirection).lengthSq() / body.I;

  const effectiveMass = 1 / (1 / body.m + rotationalTerm);

  const requiredImpulseMagnitude =
    -vTangential.length() * effectiveMass;

  const requiredForceMagnitude =
    Math.abs(requiredImpulseMagnitude) / dt;

  const maxStaticForce =
    contact.muS * normalForceMagnitude;

  if (requiredForceMagnitude <= maxStaticForce) {
    const Ff = tangentDirection
      .clone()
      .multiplyScalar(requiredImpulseMagnitude / dt);

    const tau = r.clone().cross(Ff);

    return {
      Ff,
      tau,
      mode: "static-friction",
      canApplyStatic: true,
    };
  }

  return {
    Ff: new THREE.Vector3(),
    tau: new THREE.Vector3(),
    mode: "static-limit-exceeded-use-kinetic",
    canApplyStatic: false,
  };
}