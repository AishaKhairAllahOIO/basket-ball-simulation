import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x9ed0ff);

  scene.fog = new THREE.Fog(0x9ed0ff, 45, 95);

  return scene;
}