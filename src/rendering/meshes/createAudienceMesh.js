import * as THREE from "three";

const shirtColors = [
  0xf1c40f,
  0xe74c3c,
  0x3498db,
  0x2ecc71,
  0x9b59b6,
  0xffffff,
  0xe67e22,
  0x1abc9c,
];

function createPerson(color) {
  const person = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.24, 0.12),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.75,
    })
  );

  body.position.y = 0.18;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xf1c79b,
      roughness: 0.7,
    })
  );

  head.position.y = 0.36;

  person.add(body);
  person.add(head);

  return person;
}

function createStandAudience({
  side,
  rows,
  seatsPerRow,
}) {
  const group = new THREE.Group();

  const firstRowZ = side * 10.9;

  for (let row = 0; row < rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const color =
        shirtColors[
          (row * seatsPerRow + seat) %
            shirtColors.length
        ];

      const person = createPerson(color);

      person.position.set(
        -10 + seat * 0.42,
        0.32 + row * 0.28,
        firstRowZ + side * row * 0.75
      );

      person.rotation.y =
        side > 0 ? Math.PI : 0;

      group.add(person);
    }
  }

  return group;
}

export function createAudienceMesh() {
  const group = new THREE.Group();

  group.name = "FIBA_Audience";

  group.add(
    createStandAudience({
      side: -1,
      rows: 7,
      seatsPerRow: 48,
    })
  );

  group.add(
    createStandAudience({
      side: 1,
      rows: 7,
      seatsPerRow: 48,
    })
  );

  return group;
}