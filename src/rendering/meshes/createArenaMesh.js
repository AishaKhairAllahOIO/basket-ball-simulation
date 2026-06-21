import * as THREE from "three";

const ARENA = {
  courtLength: 28,
  courtWidth: 15,
  freeZone: 2,

  bleacherRows: 7,
  rowHeight: 0.28,
  rowDepth: 0.75,

  sideBleacherWidth: 22,
  endBleacherWidth: 10,
};

function createMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.03,
  });
}

function createBleacherRow({ width, depth, height, position }) {
  const row = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    createMaterial(0x315f73)
  );

  row.position.copy(position);
  row.castShadow = true;
  row.receiveShadow = true;

  return row;
}

function createSideBleachers(side) {
  const group = new THREE.Group();

  const halfCourtWidth = ARENA.courtWidth / 2;
  const startZ = side * (halfCourtWidth + ARENA.freeZone + 1.2);

  for (let i = 0; i < ARENA.bleacherRows; i++) {
    group.add(
      createBleacherRow({
        width: ARENA.sideBleacherWidth,
        depth: ARENA.rowDepth,
        height: ARENA.rowHeight,
        position: new THREE.Vector3(
          0,
          0.14 + i * ARENA.rowHeight,
          startZ + side * i * ARENA.rowDepth
        ),
      })
    );
  }

  return group;
}

function createEndBleachers(side) {
  const group = new THREE.Group();

  const halfCourtLength = ARENA.courtLength / 2;
  const startX = side * (halfCourtLength + ARENA.freeZone + 1.2);

  for (let i = 0; i < 5; i++) {
    group.add(
      createBleacherRow({
        width: ARENA.rowDepth,
        depth: ARENA.endBleacherWidth,
        height: ARENA.rowHeight,
        position: new THREE.Vector3(
          startX + side * i * ARENA.rowDepth,
          0.14 + i * ARENA.rowHeight,
          0
        ),
      })
    );
  }

  return group;
}

export function createArenaMesh() {
  const group = new THREE.Group();
  group.name = "FIBA_Arena_Bleachers";

  group.add(createSideBleachers(1));
  group.add(createSideBleachers(-1));

  return group;
}