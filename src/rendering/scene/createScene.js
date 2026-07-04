import * as THREE from "three";
import { createSky } from './createSky.js';

export function createScene(renderer) {   // ← تستقبل renderer
  const scene = new THREE.Scene();
  

const { sky, sun, sunLight } = createSky(scene);

  // ملاحظة: createSky يعيّن background، فلا نكتب background هنا مرة ثانية
  // إذا حبيتي تخلين ضباب بلون قريب من السماء:
scene.fog = new THREE.Fog(0xd8c0b0, 60, 350);

  return scene;
}