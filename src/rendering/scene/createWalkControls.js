import * as THREE from "three";

export function createWalkControls(camera, renderer) {
  const state = {
    enabled: false,
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    sprint: false,
    yaw: 0,
    pitch: 0,
    velocity: new THREE.Vector3(),
  };

  const limits = {
    minX: -16,
    maxX: 16,
    minZ: -10.5,
    maxZ: 10.5,
    eyeHeight: 1.72,
  };

  function setEnabled(value) {
    state.enabled = value;

    if (value) {
      camera.position.y = limits.eyeHeight;
      renderer.domElement.requestPointerLock?.();
    } else {
      document.exitPointerLock?.();
    }
  }

  function toggle() {
    setEnabled(!state.enabled);
  }

  function onKeyDown(event) {
    if (event.code === "KeyW") state.moveForward = true;
    if (event.code === "KeyS") state.moveBackward = true;
    if (event.code === "KeyA") state.moveLeft = true;
    if (event.code === "KeyD") state.moveRight = true;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      state.sprint = true;
    }
  }

  function onKeyUp(event) {
    if (event.code === "KeyW") state.moveForward = false;
    if (event.code === "KeyS") state.moveBackward = false;
    if (event.code === "KeyA") state.moveLeft = false;
    if (event.code === "KeyD") state.moveRight = false;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      state.sprint = false;
    }
  }

  function onMouseMove(event) {
    if (!state.enabled) return;
    if (document.pointerLockElement !== renderer.domElement) return;

    const sensitivity = 0.0022;

    state.yaw -= event.movementX * sensitivity;
    state.pitch -= event.movementY * sensitivity;

    const maxPitch = Math.PI / 2 - 0.08;

    state.pitch = Math.max(
      -maxPitch,
      Math.min(maxPitch, state.pitch)
    );
  }

  function update(deltaTime) {
    if (!state.enabled) return;

    const speed = state.sprint ? 6.5 : 3.2;

    const direction = new THREE.Vector3();

    if (state.moveForward) direction.z -= 1;
    if (state.moveBackward) direction.z += 1;
    if (state.moveLeft) direction.x -= 1;
    if (state.moveRight) direction.x += 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();

      const yawQuaternion = new THREE.Quaternion();
      yawQuaternion.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        state.yaw
      );

      direction.applyQuaternion(yawQuaternion);

      camera.position.addScaledVector(direction, speed * deltaTime);
    }

    camera.position.x = Math.max(
      limits.minX,
      Math.min(limits.maxX, camera.position.x)
    );

    camera.position.z = Math.max(
      limits.minZ,
      Math.min(limits.maxZ, camera.position.z)
    );

    camera.position.y = limits.eyeHeight;

    camera.rotation.order = "YXZ";
    camera.rotation.y = state.yaw;
    camera.rotation.x = state.pitch;
    camera.rotation.z = 0;
  }

  function dispose() {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("mousemove", onMouseMove);
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("mousemove", onMouseMove);

  return {
    state,
    setEnabled,
    toggle,
    update,
    dispose,
  };
}