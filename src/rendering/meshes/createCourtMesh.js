import * as THREE from "three";
import { createCourtMaterials } from "../materials/createCourtMaterials.js";

function createLine(points) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
    })
  );
}

function createCircleLine(radius, segments = 96) {
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;

    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0.012,
        Math.sin(angle) * radius
      )
    );
  }

  return createLine(points);
}

export function createCourtMesh() {
  const materials = createCourtMaterials();

  const group = new THREE.Group();
  group.name = "Court";

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    materials.outerGround
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.015;
  ground.receiveShadow = true;
  group.add(ground);

  const court = new THREE.Mesh(
    new THREE.BoxGeometry(8.5, 0.04, 5.2),
    materials.floor
  );
  court.position.set(0, 0, 0);
  court.receiveShadow = true;
  group.add(court);

  const paint = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.045, 2.4),
    materials.paintArea
  );
  paint.position.set(2.55, 0.03, 0);
  paint.receiveShadow = true;
  group.add(paint);

  const centerCircle = createCircleLine(0.75);
  centerCircle.position.set(0, 0.04, 0);
  group.add(centerCircle);

  const freeThrowCircle = createCircleLine(0.72);
  freeThrowCircle.position.set(1.7, 0.04, 0);
  group.add(freeThrowCircle);

  const border = createLine([
    new THREE.Vector3(-4.25, 0.05, -2.6),
    new THREE.Vector3(4.25, 0.05, -2.6),
    new THREE.Vector3(4.25, 0.05, 2.6),
    new THREE.Vector3(-4.25, 0.05, 2.6),
    new THREE.Vector3(-4.25, 0.05, -2.6),
  ]);
  group.add(border);

  const middleLine = createLine([
    new THREE.Vector3(0, 0.05, -2.6),
    new THREE.Vector3(0, 0.05, 2.6),
  ]);
  group.add(middleLine);

  const paintBox = createLine([
    new THREE.Vector3(1.65, 0.055, -1.2),
    new THREE.Vector3(3.45, 0.055, -1.2),
    new THREE.Vector3(3.45, 0.055, 1.2),
    new THREE.Vector3(1.65, 0.055, 1.2),
    new THREE.Vector3(1.65, 0.055, -1.2),
  ]);
  group.add(paintBox);

  return group;
}