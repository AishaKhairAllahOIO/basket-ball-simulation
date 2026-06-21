import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

export function createNetMesh() {
  const group = new THREE.Group();

  const rimRadius = basketballDimensions.hoop.radius;

  const netHeight = 0.42;
  const rings = 12;

  for (let i = 0; i < rings; i++) {
    const radius =
      rimRadius - (i / rings) * (rimRadius * 0.45);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.002, 6, 48),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
      })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = -(i / rings) * netHeight;

    group.add(ring);
  }

  const strands = 16;

  for (let i = 0; i < strands; i++) {
    const angle = (i / strands) * Math.PI * 2;

    const x = Math.cos(angle) * rimRadius;
    const z = Math.sin(angle) * rimRadius;

    const strand = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.002,
        0.002,
        netHeight,
        4
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );

    strand.position.set(
      x * 0.75,
      -netHeight / 2,
      z * 0.75
    );

    group.add(strand);
  }

  group.position.set(
    basketballDimensions.hoop.position.x,
    basketballDimensions.hoop.position.y,
    basketballDimensions.hoop.position.z
  );

  return group;
}