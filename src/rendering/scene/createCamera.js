import * as THREE from "three";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );

  camera.position.set(-6.5, 4.2, 6.2);
  camera.lookAt(0.7, 1.5, 0);

  return camera;
}