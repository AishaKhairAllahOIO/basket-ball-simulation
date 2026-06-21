import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

function createSeam(radius, rotation) {
  const seam = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.01, 0.0035, 8, 160),
    new THREE.MeshStandardMaterial({
      color: 0x1b120c,
      roughness: 0.8,
    })
  );

  seam.rotation.set(rotation.x, rotation.y, rotation.z);
  return seam;
}

export function createBallMesh() {
  const radius = basketballDimensions.ball.radius;

  const group = new THREE.Group();
  group.name = "BasketballMesh";

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0xd56b28,
      roughness: 0.78,
      metalness: 0.02,
    })
  );

  ball.castShadow = true;
  ball.receiveShadow = true;

  group.add(
    ball,
    createSeam(radius, { x: Math.PI / 2, y: 0, z: 0 }),
    createSeam(radius, { x: 0, y: Math.PI / 2, z: 0 }),
    createSeam(radius, { x: 0, y: 0, z: 0 }),
    createSeam(radius * 0.72, { x: Math.PI / 2, y: 0.7, z: 0 })
  );

  return group;
}