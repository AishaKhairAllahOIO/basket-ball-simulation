import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x9ed0ff);
  scene.fog = new THREE.Fog(0x9ed0ff, 9, 22);

  return scene;
}