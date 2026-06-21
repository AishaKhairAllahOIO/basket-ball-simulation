import * as THREE from "three";

export function applyAngularVelocityToObject(object, angularVelocity, deltaTime) {
  if (angularVelocity.lengthSq() < 0.000001) return;

  const axis = angularVelocity.clone().normalize();
  const angle = angularVelocity.length() * deltaTime;

  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(axis, angle);

  object.quaternion.multiplyQuaternions(quaternion, object.quaternion);
}