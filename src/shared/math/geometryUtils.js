import * as THREE from "three";

export function getHorizontalDistanceXZ(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;

  return Math.sqrt(dx * dx + dz * dz);
}

export function closestPointOnCircleXZ(point, center, radius) {
  const dx = point.x - center.x;
  const dz = point.z - center.z;

  const length = Math.sqrt(dx * dx + dz * dz);

  if (length < 0.000001) {
    return new THREE.Vector3(center.x + radius, center.y, center.z);
  }

  return new THREE.Vector3(
    center.x + (dx / length) * radius,
    center.y,
    center.z + (dz / length) * radius
  );
}