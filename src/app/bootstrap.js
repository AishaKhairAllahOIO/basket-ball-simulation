import * as THREE from "three";

import { Simulation } from "../physics/simulation/Simulation.js";
import { FixedTimestep } from "../physics/integrators/fixedTimestep.js";

import { createScene } from "../rendering/scene/createScene.js";
import { createCamera } from "../rendering/scene/createCamera.js";
import { createRenderer } from "../rendering/scene/createRenderer.js";
import { createLights } from "../rendering/scene/createLights.js";

import { createBallMesh } from "../rendering/meshes/createBallMesh.js";
import { createCourtMesh } from "../rendering/meshes/createCourtMesh.js";
import { createBackboardMesh } from "../rendering/meshes/createBackboardMesh.js";
import { createHoopMesh } from "../rendering/meshes/createHoopMesh.js";

import { createArenaMesh } from "../rendering/meshes/createArenaMesh.js";
import { createAudienceMesh } from "../rendering/meshes/createAudienceMesh.js";

import { createLightPolesMesh } from "../rendering/meshes/createLightPolesMesh.js";
import { createControls } from "../rendering/scene/createControls.js";
export function bootstrap() {
  const scene = createScene();
  const camera = createCamera();
  const renderer = createRenderer();

  document.body.appendChild(renderer.domElement);

  createLights(scene);

  const simulation = new Simulation();
  const fixedTimestep = new FixedTimestep({
    timestep: 1 / 120,
    maxSubSteps: 8,
  });

  const ballMesh = createBallMesh();
  const courtMesh = createCourtMesh();
  const backboardMesh = createBackboardMesh();
  const hoopMesh = createHoopMesh();
  const arenaMesh = createArenaMesh();
const audienceMesh = createAudienceMesh();
const lightPolesMesh = createLightPolesMesh();
const controls = createControls(camera, renderer);

  scene.add(courtMesh);
  scene.add(backboardMesh);
  scene.add(hoopMesh);
  scene.add(ballMesh);
  scene.add(courtMesh);
scene.add(arenaMesh);
scene.add(audienceMesh);
scene.add(lightPolesMesh);
scene.add(backboardMesh);
scene.add(hoopMesh);
scene.add(ballMesh);

  const clock = new THREE.Clock();

  function syncBallMesh() {
    ballMesh.position.copy(simulation.ball.position);

    const angularVelocity = simulation.ball.angularVelocity;
    const spinAxis = angularVelocity.clone();

    if (spinAxis.lengthSq() > 0.000001) {
      spinAxis.normalize();
      const spinAngle = angularVelocity.length() * fixedTimestep.timestep;
      ballMesh.rotateOnAxis(spinAxis, spinAngle);
    }
  }

  function resetSimulation() {
    simulation.reset();
    ballMesh.position.copy(simulation.ball.position);
    ballMesh.rotation.set(0, 0, 0);
  }

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      resetSimulation();
    }
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  resetSimulation();

  function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    fixedTimestep.update(deltaTime, (dt) => {
      simulation.step(dt);
    });

    syncBallMesh();
    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}