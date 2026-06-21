import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    300
  );

  camera.position.set(-10, 7, 13);
  camera.lookAt(0, 1.2, 0);

  return camera;
}