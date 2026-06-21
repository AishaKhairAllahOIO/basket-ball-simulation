import * as THREE from "three";

import { Simulation } from "../physics/simulation/Simulation.js";
import { FixedTimestep } from "../physics/integrators/fixedTimestep.js";
import { physicsConfig } from "../physics/config/physicsConfig.js";

import { createScene } from "../rendering/scene/createScene.js";
import { createCamera } from "../rendering/scene/createCamera.js";
import { createRenderer } from "../rendering/scene/createRenderer.js";
import { createLights } from "../rendering/scene/createLights.js";
import { createControls } from "../rendering/scene/createControls.js";

import { createBallMesh } from "../rendering/meshes/createBallMesh.js";
import { createCourtMesh } from "../rendering/meshes/createCourtMesh.js";
import { createBackboardMesh } from "../rendering/meshes/createBackboardMesh.js";
import { createHoopMesh } from "../rendering/meshes/createHoopMesh.js";
import { createNetMesh } from "../rendering/meshes/createNetMesh.js";
import { createArenaMesh } from "../rendering/meshes/createArenaMesh.js";
import { createAudienceMesh } from "../rendering/meshes/createAudienceMesh.js";
import { createLightPolesMesh } from "../rendering/meshes/createLightPolesMesh.js";
import { createPlayerMesh } from "../rendering/meshes/createPlayerMesh.js";

import { createPhysicsPanel } from "../ui/createPhysicsPanel.js";

export function bootstrap() {
  const scene = createScene();
  const camera = createCamera();
  const renderer = createRenderer();
  const controls = createControls(camera, renderer);

  document.body.appendChild(renderer.domElement);

  createLights(scene);

  const simulation = new Simulation();

  const fixedTimestep = new FixedTimestep({
    timestep: physicsConfig.integrator.fixedTimestep,
    maxSubSteps: physicsConfig.integrator.maxSubSteps,
  });

  const courtMesh = createCourtMesh();
  const arenaMesh = createArenaMesh();
  const audienceMesh = createAudienceMesh();
  const lightPolesMesh = createLightPolesMesh();

  const backboardMesh = createBackboardMesh();
  const hoopMesh = createHoopMesh();
  const netMesh = createNetMesh();
  const playerMesh = createPlayerMesh();
  const ballMesh = createBallMesh();

  scene.add(
    courtMesh,
    arenaMesh,
    audienceMesh,
    lightPolesMesh,
    backboardMesh,
    hoopMesh,
    netMesh,
    playerMesh,
    ballMesh
  );

  const clock = new THREE.Clock();

  function syncBallMesh(deltaTime) {
    ballMesh.position.copy(simulation.ball.position);

    const angularVelocity = simulation.ball.angularVelocity;

    if (angularVelocity.lengthSq() > 0.000001) {
      const spinAxis = angularVelocity.clone().normalize();
      const spinAngle = angularVelocity.length() * deltaTime;

      ballMesh.rotateOnAxis(spinAxis, spinAngle);
    }
  }

  function resetSimulation() {
    simulation.reset();

    ballMesh.position.copy(simulation.ball.position);
    ballMesh.rotation.set(0, 0, 0);
  }

  createPhysicsPanel({
    simulation,
    onReset: resetSimulation,
  });

  function handleKeyDown(event) {
    if (event.code === "Space") {
      resetSimulation();
    }
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", handleResize);

  resetSimulation();

  function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    fixedTimestep.timestep = physicsConfig.integrator.fixedTimestep;
    fixedTimestep.maxSubSteps = physicsConfig.integrator.maxSubSteps;

    fixedTimestep.update(deltaTime, (dt) => {
      simulation.step(dt);
    });

    syncBallMesh(deltaTime);
    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}