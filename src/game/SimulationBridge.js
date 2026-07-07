import * as THREE from "three";

import { Basketball } from "../physics/bodies/Basketball.js";
import { PhysicsWorld } from "../physics/simulation/PhysicsWorld.js";
import { CourtGeometry } from "../physics/properties/CourtGeometry.js";

const WORLD_UP = new THREE.Vector3(0, 1, 0);

function revToRadPerSecond(rev) {
  return rev * 2 * Math.PI;
}

// يضبط حالة الجسم لتصويبة جديدة (بدل بناء جسم جديد في كل مرة)
function configureBody(body, { position, velocity, omega }) {
  body.position.copy(position);
  body.previousPosition.copy(position);

  body.v.copy(velocity);
  body.a.set(0, 0, 0);

  body.omega.copy(omega);
  body.alpha.set(0, 0, 0);

  body.F.set(0, 0, 0);
  body.tau.set(0, 0, 0);

  body.hasScored = false;
  body.hasPassedAboveRim = false;
  body.touchedGround = false;
  body.touchedRim = false;
  body.touchedBackboard = false;
}

function velocityFromAngle(speed, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(theta) * speed, Math.sin(theta) * speed, 0);
}

function backspinFor(direction, spinRev) {
  return new THREE.Vector3()
    .crossVectors(WORLD_UP, direction)
    .normalize()
    .multiplyScalar(revToRadPerSecond(spinRev));
}

export function createSimulationBridge({
  ballMesh, 
  scene = null,
  trajectory = null, 
  contactPoints = null,
  physicsDebugger = null, 
  walk = null, 
  onScore = null,

  defaultShot = {
    position: new THREE.Vector3(
      CourtGeometry.player.position.x,
      1.75,
      CourtGeometry.player.position.z
    ),
    speed: 11.0,
    angleDeg: 52,
    spinRev: 6,
  },

  cameraShot = { speed: 10.5, spinRev: 6 },
} = {}) {
  const courtOverrides = {};

  const body = new Basketball();
  let world = new PhysicsWorld(body, courtOverrides);

  const trajectoryPoints = [];
  const MAX_POINTS = 400;

  let lastTouched = { ground: false, rim: false, backboard: false };
  let scoredAnnounced = false;

  const tmpQuat = new THREE.Quaternion();
  const tmpAxis = new THREE.Vector3();

  function resetTracking() {
    trajectoryPoints.length = 0;
    lastTouched = { ground: false, rim: false, backboard: false };
    scoredAnnounced = false;
    trajectory?.clear();
    contactPoints?.clear();
  }

  function reset() {
    configureBody(body, {
      position: defaultShot.position.clone(),
      velocity: velocityFromAngle(defaultShot.speed, defaultShot.angleDeg),
      omega: new THREE.Vector3(0, 0, -revToRadPerSecond(defaultShot.spinRev)),
    });
    world = new PhysicsWorld(body, courtOverrides);
    resetTracking();
  }

  function shoot({ position, velocity, omega }) {
    configureBody(body, {
      position: position.clone(),
      velocity: velocity.clone(),
      omega: omega ? omega.clone() : new THREE.Vector3(),
    });
    world = new PhysicsWorld(body, courtOverrides);
    resetTracking();
  }

  function shootFromCamera(overrides = {}) {
    if (!walk) return false;
    const { origin, direction } = walk.getShotRay();
    const speed = overrides.speed ?? cameraShot.speed;
    const spinRev = overrides.spinRev ?? cameraShot.spinRev;

    shoot({
      position: origin,
      velocity: direction.clone().multiplyScalar(speed),
      omega: backspinFor(direction, spinRev),
    });
    return true;
  }
  

  function predictPath({ position, velocity, omega }, duration = 2, dt = 1 / 60) {
    const ghost = new Basketball();
    configureBody(ghost, {
      position: position.clone(),
      velocity: velocity.clone(),
      omega: omega ? omega.clone() : new THREE.Vector3(),
    });
    const ghostWorld = new PhysicsWorld(ghost, courtOverrides);

    const points = [ghost.position.clone()];
    const steps = Math.floor(duration / dt);

    for (let i = 0; i < steps; i++) {
      ghostWorld.step(dt);
      points.push(ghost.position.clone());
      if (ghost.position.y - ghost.R <= 0 && ghost.v.y <= 0) break;
    }
    return points;
  }

  function syncVisual(dt) {
    ballMesh.position.copy(body.position);

    const angle = body.omega.length() * dt;
    if (angle > 1e-6) {
      tmpAxis.copy(body.omega).normalize();
      tmpQuat.setFromAxisAngle(tmpAxis, angle);
      ballMesh.quaternion.premultiply(tmpQuat);
    }
  }

  function updateTrajectory() {
    if (!trajectory) return;
    trajectoryPoints.push(body.position.clone());
    if (trajectoryPoints.length > MAX_POINTS) trajectoryPoints.shift();
    trajectory.render(trajectoryPoints);
  }

  function updateContactMarkers() {
    if (!contactPoints) return;
    if (body.touchedGround && !lastTouched.ground) contactPoints.add(body.position);
    if (body.touchedRim && !lastTouched.rim) contactPoints.add(body.position);
    if (body.touchedBackboard && !lastTouched.backboard) contactPoints.add(body.position);
    lastTouched = {
      ground: body.touchedGround,
      rim: body.touchedRim,
      backboard: body.touchedBackboard,
    };
  }

  function update(dt) {
    const result = world.step(dt);

    syncVisual(dt);
    updateTrajectory();
    updateContactMarkers();

    physicsDebugger?.printBall({
      position: body.position,
      velocity: body.v,
      angularVelocity: body.omega,
    });

    if (result?.hasScored && !scoredAnnounced) {
      scoredAnnounced = true;
      onScore?.();
    }

    return result;
  }

  function attachInput() {
    function onKeyDown(e) {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (walk?.state.enabled) shootFromCamera();
      else reset();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }

  return {
    update,
    reset,
    shoot,
    shootFromCamera,
    predictPath,
    attachInput,
    getBody: () => body,
    getWorld: () => world,
  };
}