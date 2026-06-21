import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

export function createHoopMesh() {
  const hoop = basketballDimensions.hoop;

  const group = new THREE.Group();

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(hoop.radius, hoop.tubeRadius, 16, 128),
    new THREE.MeshStandardMaterial({
      color: 0xff4500,
      roughness: 0.35,
      metalness: 0.4,
    })
  );

  rim.rotation.x = Math.PI / 2;
  rim.position.set(hoop.position.x, hoop.position.y, hoop.position.z);
  rim.castShadow = true;

  const connector = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.025, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xff4500 })
  );

  connector.position.set(
    hoop.position.x + 0.16,
    hoop.position.y,
    hoop.position.z
  );

  group.add(rim, connector);

  return group;
}