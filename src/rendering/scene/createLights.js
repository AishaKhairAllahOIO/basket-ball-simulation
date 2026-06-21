import * as THREE from "three";

export function createLights(scene) {
  const hemisphere = new THREE.HemisphereLight(0xbfdfff, 0x405040, 1.6);

  const sun = new THREE.DirectionalLight(0xffffff, 1.35);
  sun.position.set(-8, 12, 8);
  sun.castShadow = true;

  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;

  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 45;
  sun.shadow.camera.left = -24;
  sun.shadow.camera.right = 24;
  sun.shadow.camera.top = 20;
  sun.shadow.camera.bottom = -20;

  sun.shadow.bias = -0.00005;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 5;

  scene.add(hemisphere, sun);
}