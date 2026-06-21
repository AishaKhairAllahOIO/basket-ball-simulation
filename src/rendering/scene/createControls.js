import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.screenSpacePanning = true;

  controls.minDistance = 4;
  controls.maxDistance = 55;

  controls.minPolarAngle = 0.08;
  controls.maxPolarAngle = Math.PI * 0.47;

  controls.panSpeed = 1.2;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 1.1;

  controls.target.set(0, 1.2, 0);
  controls.update();

  return controls;
}