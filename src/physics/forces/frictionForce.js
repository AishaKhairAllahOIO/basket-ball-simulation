import * as THREE from "three";
import {
  EPSILON,
  getTangentialComponent,
} from "../math/physicsMath.js";

export function contactPointVelocity(body, contactPoint) {
  const r = contactPoint.clone().sub(body.position);

  return body.velocity
    .clone()
    .add(body.angularVelocity.clone().cross(r));
}

export function frictionForce({
  body,
  contactPoint,
  normal,
  normalForceMagnitude,
  muS,
  muK,
}) {
  if (normalForceMagnitude <= 0) {
    return {
      Ff: new THREE.Vector3(),
      tau: new THREE.Vector3(),
      mode: "none",
    };
  }

  const vContact = contactPointVelocity(body, contactPoint);
  const vt = getTangentialComponent(vContact, normal);
  const vtMagnitude = vt.length();

  if (vtMagnitude < EPSILON) {
    return {
      Ff: new THREE.Vector3(),
      tau: new THREE.Vector3(),
      mode: "static-rest",
    };
  }

  const maxStatic = muS * normalForceMagnitude;
  const kinetic = muK * normalForceMagnitude;

  const FfMagnitude = Math.min(maxStatic, kinetic);

  const Ff = vt
    .clone()
    .normalize()
    .multiplyScalar(-FfMagnitude);

  const r = contactPoint.clone().sub(body.position);
  const tau = r.clone().cross(Ff);

  return {
    Ff,
    tau,
    mode: "kinetic-sliding",
  };
}