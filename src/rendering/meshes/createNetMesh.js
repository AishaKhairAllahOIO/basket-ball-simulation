import * as THREE from "three";
import { CourtProperties } from "../../physics/properties/CourtProperties.js";

function createSingleNet(side) {
  const group = new THREE.Group();

  const hoop = CourtProperties.hoop;
  const rimRadius = hoop.rimInnerDiameter / 2;
  const netHeight = CourtProperties.net.height;

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
  });

  for (let i = 0; i < 8; i++) {
    const radius = rimRadius - (i / 8) * rimRadius * 0.42;

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.002, 6, 48),
      material
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = -(i / 8) * netHeight;

    group.add(ring);
  }

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;

    const strand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, netHeight, 6),
      material
    );

    strand.position.set(
      Math.cos(angle) * rimRadius * 0.78,
      -netHeight / 2,
      Math.sin(angle) * rimRadius * 0.78
    );

    group.add(strand);
  }

  group.position.set(side * Math.abs(hoop.x), hoop.y, 0);

  return group;
}

export function createNetMesh() {
  const group = new THREE.Group();
  group.name = "TwoNets";

  group.add(createSingleNet(1));
  group.add(createSingleNet(-1));

  return group;
}