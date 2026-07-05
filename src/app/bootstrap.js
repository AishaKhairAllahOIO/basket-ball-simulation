
import * as THREE from "three";

import { Basketball } from "../physics/bodies/Basketball.js";
import { PhysicsWorld } from "../physics/simulation/PhysicsWorld.js";
import { PhysicsConfig } from "../physics/config/PhysicsConfig.js";
import { FixedTimestep } from "../physics/integrators/FixedTimestep.js";


import { createScene } from "../rendering/scene/createScene.js";
import { createCamera } from "../rendering/scene/createCamera.js";
import { createRenderer } from "../rendering/scene/createRenderer.js";
import { createLights } from "../rendering/scene/createLights.js";
import { createControls } from "../rendering/scene/createControls.js";
import { createWalkControls } from "../rendering/scene/createWalkControls.js";

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
  const renderer = createRenderer();
  const scene = createScene(renderer);
  const camera = createCamera();

  const controls = createControls(camera, renderer);
  const walkControls = createWalkControls(camera, renderer);

  let cameraMode = "orbit";

  document.body.appendChild(renderer.domElement);

  createLights(scene);

  const ball = new Basketball();
  const physicsWorld = new PhysicsWorld(ball);

  const fixedTimestep = new FixedTimestep({
    timestep: PhysicsConfig.integrator.fixedTimestep,
    maxSubSteps: PhysicsConfig.integrator.maxSubSteps,
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
    ballMesh.position.copy(ball.position);

    if (ball.omega.lengthSq() > 0.000001) {
      const spinAxis = ball.omega.clone().normalize();
      const spinAngle = ball.omega.length() * deltaTime;

      ballMesh.rotateOnAxis(spinAxis, spinAngle);
    }
  }

  function resetBall() {
    const freshBall = new Basketball();

    ball.m = freshBall.m;
    ball.R = freshBall.R;
    ball.I = freshBall.I;

    ball.position.copy(freshBall.position);
    ball.previousPosition.copy(freshBall.previousPosition);

    ball.v.copy(freshBall.v);
    ball.a.copy(freshBall.a);

    ball.omega.copy(freshBall.omega);
    ball.alpha.copy(freshBall.alpha);

    ball.F.set(0, 0, 0);
    ball.tau.set(0, 0, 0);

    ball.hasScored = false;
    ball.hasPassedAboveRim = false;
    ball.touchedGround = false;
    ball.touchedRim = false;
    ball.touchedBackboard = false;
  }

  function resetSimulation() {
    resetBall();

    ballMesh.position.copy(ball.position);
    ballMesh.rotation.set(0, 0, 0);
  }

  function enableOrbitMode() {
    cameraMode = "orbit";

    walkControls.setEnabled(false);

    camera.position.set(-10, 7, 13);
    camera.lookAt(0, 1.2, 0);

    controls.target.set(0, 1.2, 0);
    controls.enabled = true;
    controls.update();
  }

  function enableWalkMode() {
    cameraMode = "walk";

    controls.enabled = false;

    camera.position.set(0, 1.72, 6);
    camera.rotation.set(0, Math.PI, 0);

    walkControls.state.yaw = Math.PI;
    walkControls.state.pitch = 0;
    walkControls.setEnabled(true);
  }

  function toggleCameraMode() {
    if (cameraMode === "orbit") {
      enableWalkMode();
    } else {
      enableOrbitMode();
    }
  }

  createPhysicsPanel({
    ball,
    physicsWorld,
    onReset: resetSimulation,
  });

  function handleKeyDown(event) {
    if (event.code === "Space") {
      resetSimulation();
    }

    if (event.code === "KeyC") {
      toggleCameraMode();
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

  enableOrbitMode();
  resetSimulation();

  function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    fixedTimestep.timestep = PhysicsConfig.integrator.fixedTimestep;
    fixedTimestep.maxSubSteps = PhysicsConfig.integrator.maxSubSteps;

    fixedTimestep.update(deltaTime, (dt) => {
      physicsWorld.step(dt);
    });

    syncBallMesh(deltaTime);

    if (cameraMode === "orbit") {
      controls.update();
    } else {
      walkControls.update(deltaTime);
    }

    renderer.render(scene, camera);
  }

  animate();
}