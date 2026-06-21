import * as THREE from "three";

const shirtColors = [
  0xf1c40f,
  0xe74c3c,
  0x3498db,
  0x2ecc71,
  0x9b59b6,
  0xffffff,
  0xe67e22,
];

function createPerson(color) {
  const person = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.22, 0.11),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
    })
  );
  body.position.y = 0.16;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xf3d0a4,
      roughness: 0.6,
    })
  );
  head.position.y = 0.32;

  person.add(body, head);

  return person;
}

export function createAudienceMesh() {
  const group = new THREE.Group();
  group.name = "Audience";

  const rows = [
    { z: -3.6, count: 28, y: 0.28 },
    { z: -4.05, count: 28, y: 0.5 },
    { z: -4.5, count: 28, y: 0.72 },
    { z: -4.95, count: 28, y: 0.94 },
    { z: 3.6, count: 28, y: 0.28 },
    { z: 4.05, count: 28, y: 0.5 },
    { z: 4.5, count: 28, y: 0.72 },
    { z: 4.95, count: 28, y: 0.94 },
  ];

  for (const row of rows) {
    for (let i = 0; i < row.count; i++) {
      const color = shirtColors[(i + row.z * 10) % shirtColors.length | 0];

      const person = createPerson(color);
      person.position.set(-3.6 + i * 0.27, row.y, row.z);
      person.rotation.y = row.z < 0 ? 0 : Math.PI;

      group.add(person);
    }
  }

  return group;
}