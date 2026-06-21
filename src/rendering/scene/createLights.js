import * as THREE from "three";

export function createLights(scene) {
  const hemisphere = new THREE.HemisphereLight(0xbfdfff, 0x224422, 1.7);

  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-4, 7, 5);
  sun.castShadow = true;

  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;

  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 30;
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;

  scene.add(hemisphere, sun);
}