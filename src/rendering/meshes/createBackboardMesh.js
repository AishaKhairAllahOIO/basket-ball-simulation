import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

function createSingleBackboard(side) {
  const b = basketballDimensions.backboard;
  const group = new THREE.Group();

  const x = side * Math.abs(b.position.x);

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(b.depth, b.height, b.width),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      roughness: 0.12,
      transmission: 0.25,
    })
  );

  board.position.set(x, b.position.y, 0);
  board.castShadow = true;
  board.receiveShadow = true;

  const targetSquare = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.01, 0.45, 0.59)),
    new THREE.LineBasicMaterial({ color: 0xff6b35 })
  );

  targetSquare.position.set(x - side * 0.035, b.position.y + 0.05, 0);

  const support = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 3.05, 20),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.55,
    })
  );

  support.position.set(x + side * 0.45, 1.52, 0);
  support.castShadow = true;

  group.add(board, targetSquare, support);

  return group;
}

export function createBackboardMesh() {
  const group = new THREE.Group();
  group.name = "TwoBackboards";

  group.add(createSingleBackboard(1));
  group.add(createSingleBackboard(-1));

  return group;
}