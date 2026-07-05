import * as THREE from "three";
// import { basketballDimensions } from "../../physics/constants/studyConstants.js";

export function createPlayerMesh() {
  const group = new THREE.Group();
  group.name = "ShooterPlayer";

  const skin = new THREE.MeshStandardMaterial({ color: 0xf1c08b, roughness: 0.65 });
  const jersey = new THREE.MeshStandardMaterial({ color: 0x1f8f55, roughness: 0.7 });
  const shorts = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
  const shoes = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.24), jersey);
  body.position.y = 1.15;
  body.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), skin);
  head.position.y = 1.62;
  head.castShadow = true;

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.55, 0.13), shorts);
  leftLeg.position.set(-0.11, 0.58, 0);
  leftLeg.castShadow = true;

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.11;

  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.28), shoes);
  leftShoe.position.set(-0.11, 0.28, 0.05);
  leftShoe.castShadow = true;

  const rightShoe = leftShoe.clone();
  rightShoe.position.x = 0.11;

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.72, 16), skin);
  leftArm.position.set(-0.32, 1.27, 0);
  leftArm.rotation.z = -0.35;
  leftArm.castShadow = true;

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.82, 16), skin);
  rightArm.position.set(0.31, 1.42, 0);
  rightArm.rotation.z = 0.55;
  rightArm.castShadow = true;

  group.add(body, head, leftLeg, rightLeg, leftShoe, rightShoe, leftArm, rightArm);

  group.position.set(
    basketballDimensions.player.position.x,
    basketballDimensions.player.position.y,
    basketballDimensions.player.position.z
  );

  group.rotation.y = -Math.PI / 2;

  return group;
}