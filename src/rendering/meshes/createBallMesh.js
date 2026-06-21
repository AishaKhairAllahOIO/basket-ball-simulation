import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

export function createBallMesh() {
  const geometry = new THREE.SphereGeometry(
    basketballDimensions.ball.radius,
    64,
    64
  );

  const material = new THREE.MeshStandardMaterial({
    color: 0xc96528,
    roughness: 0.75,
    metalness: 0.05,
  });

  const ball = new THREE.Mesh(geometry, material);
  ball.castShadow = true;

  const seamMaterial = new THREE.LineBasicMaterial({ color: 0x111111 });

  const ringGeometry = new THREE.TorusGeometry(
    basketballDimensions.ball.radius * 1.01,
    0.002,
    8,
    96
  );

  const ring1 = new THREE.Mesh(ringGeometry, seamMaterial);
  const ring2 = ring1.clone();
  const ring3 = ring1.clone();

  ring2.rotation.x = Math.PI / 2;
  ring3.rotation.y = Math.PI / 2;

  ball.add(ring1, ring2, ring3);

  return ball;
}