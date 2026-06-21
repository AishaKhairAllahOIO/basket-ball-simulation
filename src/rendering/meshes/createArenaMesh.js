import * as THREE from "three";

function createBleacherRow({ width, depth, height, position }) {
  const row = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: 0x315f73,
      roughness: 0.7,
    })
  );

  row.position.copy(position);
  row.castShadow = true;
  row.receiveShadow = true;

  return row;
}

export function createArenaMesh() {
  const group = new THREE.Group();
  group.name = "Arena";

  for (let i = 0; i < 7; i++) {
    group.add(
      createBleacherRow({
        width: 7.5,
        depth: 0.55,
        height: 0.22,
        position: new THREE.Vector3(-0.2, 0.12 + i * 0.22, -3.6 - i * 0.45),
      })
    );
  }

  for (let i = 0; i < 7; i++) {
    group.add(
      createBleacherRow({
        width: 7.5,
        depth: 0.55,
        height: 0.22,
        position: new THREE.Vector3(-0.2, 0.12 + i * 0.22, 3.6 + i * 0.45),
      })
    );
  }

  for (let i = 0; i < 5; i++) {
    group.add(
      createBleacherRow({
        width: 0.55,
        depth: 5.5,
        height: 0.22,
        position: new THREE.Vector3(-5.0 - i * 0.45, 0.12 + i * 0.22, 0),
      })
    );
  }

  return group;
}