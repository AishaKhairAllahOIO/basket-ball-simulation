import * as THREE from "three";
import { CourtProperties } from "../../physics/properties/CourtProperties.js";

function createSingleHoop(side) {
  const hoop = CourtProperties.hoop;
  const group = new THREE.Group();

  const x = side * Math.abs(hoop.x);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(
      hoop.rimInnerDiameter / 2,
      hoop.rimMetalDiameter / 2,
      20,
      160
    ),
    new THREE.MeshStandardMaterial({
      color: 0xff4d1f,
      roughness: 0.28,
      metalness: 0.55,
    })
  );

  rim.rotation.x = Math.PI / 2;
  rim.position.set(x, hoop.y, 0);
  rim.castShadow = true;

  const connector = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.035, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0xff4d1f,
      roughness: 0.35,
      metalness: 0.45,
    })
  );

  connector.position.set(x + side * 0.28, hoop.y, 0);
  connector.castShadow = true;

  group.add(rim, connector);

  return group;
}

export function createHoopMesh() {
  const group = new THREE.Group();
  group.name = "TwoHoops";

  group.add(createSingleHoop(1));
  group.add(createSingleHoop(-1));

  return group;
}