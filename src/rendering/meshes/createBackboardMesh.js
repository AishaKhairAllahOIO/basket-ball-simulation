import * as THREE from "three";
import { basketballDimensions } from "../../shared/constants/dimensions.js";

export function createBackboardMesh() {
  const b = basketballDimensions.backboard;

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(b.depth, b.height, b.width),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
    })
  );

  mesh.position.set(b.position.x, b.position.y, b.position.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}