import * as THREE from "three";
import { CourtProperties } from "../../physics/properties/CourtProperties.js";

function createSingleBackboard(side) {
  const board = CourtProperties.backboard;
  const hoop = CourtProperties.hoop;
  const group = new THREE.Group();

  const x = side * Math.abs(board.x);

  const boardMesh = new THREE.Mesh(
    new THREE.BoxGeometry(board.depth, board.height, board.width),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      roughness: 0.12,
      transmission: 0.25,
    })
  );

  boardMesh.position.set(x, board.y, 0);
  boardMesh.castShadow = true;
  boardMesh.receiveShadow = true;

  const targetSquare = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.01, 0.46, 0.61)),
    new THREE.LineBasicMaterial({ color: 0xff6b35 })
  );

  targetSquare.position.set(x - side * 0.035, hoop.y + 0.23, 0);

  const support = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 3.05, 20),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.55,
    })
  );

  support.position.set(x + side * 0.45, 1.52, 0);
  support.castShadow = true;

  group.add(boardMesh, targetSquare, support);

  return group;
}

export function createBackboardMesh() {
  const group = new THREE.Group();
  group.name = "TwoBackboards";

  group.add(createSingleBackboard(1));
  group.add(createSingleBackboard(-1));

  return group;
}