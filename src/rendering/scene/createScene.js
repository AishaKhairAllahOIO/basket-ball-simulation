import * as THREE from "three";
import { createSky } from "./createSky.js";

export function createScene(renderer) {
  const scene = new THREE.Scene();

  const { sky, sun, sunLight } = createSky(scene);
  scene.fog = new THREE.Fog(0xd8c0b0, 60, 350);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  return scene;
}
