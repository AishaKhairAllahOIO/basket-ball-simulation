import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;

  controls.minDistance = 2.2;
  controls.maxDistance = 14;

  controls.maxPolarAngle = Math.PI * 0.48;

  controls.target.set(0.8, 1.4, 0);
  controls.update();

  return controls;
}