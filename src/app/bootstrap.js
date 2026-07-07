import * as THREE from "three";

import { createScene } from "../rendering/scene/createScene.js";
import { createCamera } from "../rendering/scene/createCamera.js";
import { createRenderer } from "../rendering/scene/createRenderer.js";
import { createLights } from "../rendering/scene/createLights.js";
import { createControls } from "../rendering/scene/createControls.js";
import { createWalkControls } from "../rendering/scene/createWalkControls.js";
import { createArenaMesh } from "../rendering/meshes/createArenaMesh.js";
import { createAudienceMesh } from "../rendering/meshes/createAudienceMesh.js";
import { createCourtMesh } from "../rendering/meshes/createCourtMesh.js";
import { createBackboardMesh } from "../rendering/meshes/createBackboardMesh.js";
import { createHoopMesh } from "../rendering/meshes/createHoopMesh.js";
import { createNetMesh } from "../rendering/meshes/createNetMesh.js";
import { createLightPolesMesh } from "../rendering/meshes/createLightPolesMesh.js";
import { createBallMesh } from "../rendering/meshes/createBallMesh.js";
import { TrajectoryRenderer } from "../rendering/debug/TrajectoryRenderer.js";
import { ContactPointsRenderer } from "../rendering/debug/ContactPointsRenderer.js";
import { createSimulationBridge } from "../game/SimulationBridge.js";
import { exposePhysicsLab } from "../game/PhysicsConsoleLab.js";
import { runPhysicsTest } from "../game/PhysicsConsoleTest.js";

export function bootstrap() 
{
  const renderer = createRenderer();
  document.body.appendChild(renderer.domElement);

  const scene = createScene(renderer);
  const camera = createCamera();
  const controls = createControls(camera, renderer);

  createLights(scene);

  scene.add(createArenaMesh());
  scene.add(createAudienceMesh());
  scene.add(createCourtMesh());
  scene.add(createBackboardMesh());
  scene.add(createHoopMesh());
  scene.add(createNetMesh());
  scene.add(createLightPolesMesh());

  const ballMesh = createBallMesh();
  scene.add(ballMesh);

  const trajectory = new TrajectoryRenderer(scene);
  const contactPoints = new ContactPointsRenderer(scene);

  const walk = createWalkControls(camera, renderer, {
    orbitControls: controls,
    startPosition: { x: 2.8, z: 0 },
    lookAt: { x: 12.425, y: 3.05, z: 0 },
  });

  const simulation = createSimulationBridge({
    ballMesh,
    scene,
    trajectory,
    contactPoints,
    walk,
    onScore() {
      console.log("=== SCORE DETECTED ===");
    },
  });

  simulation.reset();
  simulation.attachInput();
  runPhysicsTest();

  exposePhysicsLab();

  window.simulation = simulation;

  const clock = new THREE.Clock();

  function animate() {
    const dt = Math.min(clock.getDelta(), 1 / 30);

    controls.update();
    walk.update(dt);
    simulation.update(dt);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

}