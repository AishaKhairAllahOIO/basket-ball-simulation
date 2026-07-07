import { Sky } from "three/examples/jsm/objects/Sky.js";
import * as THREE from "three";

export function createSky(scene) {
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  const effectController = {
    turbidity: 12,
    rayleigh: 2.5,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 4,
    azimuth: 100,
  };

  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = effectController.turbidity;
  uniforms["rayleigh"].value = effectController.rayleigh;
  uniforms["mieCoefficient"].value = effectController.mieCoefficient;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);
  sun.setFromSphericalCoords(1, phi, theta);
  uniforms["sunPosition"].value.copy(sun);

  const sunLight = new THREE.DirectionalLight(0xffddaa, 1.5);
  sunLight.position.copy(sun).multiplyScalar(100);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  scene.add(sunLight);

  return { sky, sun, sunLight };
}
