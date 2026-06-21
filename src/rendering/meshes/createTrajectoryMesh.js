import * as THREE from "three";

export function createTrajectoryMesh() {
  return new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: 0xffff00,
    })
  );
}