import * as THREE from "three";

const EPSILON = 1e-8;

export function getContactPointVelocity(body, contactPoint) {
  const r = contactPoint.clone().sub(body.position);

  return body.v.clone().add(body.omega.clone().cross(r));
}

export function KineticFriction(body, contact, normalForceMagnitude) {
  if (!contact || normalForceMagnitude <= 0) {
    return {
      Ff: new THREE.Vector3(),
      tau: new THREE.Vector3(),
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
    };
  }

  const Ff = vTangential
    .clone()
    .normalize()
    .multiplyScalar(-contact.muK * normalForceMagnitude);

  const r = contact.contactPoint.clone().sub(body.position);
  const tau = r.clone().cross(Ff);

  return { Ff, tau };
}