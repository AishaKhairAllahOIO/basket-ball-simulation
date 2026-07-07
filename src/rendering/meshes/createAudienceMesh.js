import * as THREE from "three";
import { STAND, seatAnchor } from "./createArenaMesh.js";

const SHIRTS = [
  0xe6482e, 0xf2c14e, 0x2e8bd6, 0x36b37e, 0x8e5bd0,
  0xecf0f1, 0xe67e22, 0x16a99b, 0xd94f8a, 0x4a63d0,
];

const SKINS = [0xf2c79b, 0xe0a06e, 0xc7834e, 0x9c6438, 0x7a4a28];

const EMPTY_CHANCE = 0.12; 

export function createAudienceMesh() {
  const group = new THREE.Group();
  group.name = "FIBA_Audience";

  const count = STAND.rows * STAND.seatsPerRow * 2;

  const torsoGeo = new THREE.BoxGeometry(0.32, 0.42, 0.24);
  const headGeo = new THREE.SphereGeometry(0.11, 10, 10);
  const lapGeo = new THREE.BoxGeometry(0.3, 0.16, 0.34); // أفخاذ

  const torsoMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
  const headMat = new THREE.MeshStandardMaterial({ roughness: 0.75 });
  const lapMat = new THREE.MeshStandardMaterial({ roughness: 0.8, color: 0x2a2a2a });

  const torso = new THREE.InstancedMesh(torsoGeo, torsoMat, count);
  const head = new THREE.InstancedMesh(headGeo, headMat, count);
  const lap = new THREE.InstancedMesh(lapGeo, lapMat, count);

  torso.castShadow = true;
  for (const m of [torso, head, lap]) {
    m.frustumCulled = false;
  }

  const dummy = new THREE.Object3D();
  const c = new THREE.Color();

  let i = 0;
  for (const side of [1, -1]) {
    for (let row = 0; row < STAND.rows; row++) {
      for (let seat = 0; seat < STAND.seatsPerRow; seat++) {
        const a = seatAnchor(side, row, seat);

        if (Math.random() < EMPTY_CHANCE) {
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(0.0001, 0.0001, 0.0001);
          dummy.position.set(0, -50, 0);
          dummy.updateMatrix();
          torso.setMatrixAt(i, dummy.matrix);
          head.setMatrixAt(i, dummy.matrix);
          lap.setMatrixAt(i, dummy.matrix);
          c.set(0x000000);
          torso.setColorAt(i, c);
          head.setColorAt(i, c);
          i++;
          continue;
        }

        const courtDir = -side; 
        const jx = (Math.random() - 0.5) * 0.06;
        const s = 0.94 + Math.random() * 0.14;

        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(s, s, s);

        dummy.position.set(a.x + jx, a.y + 0.5, a.z - side * 0.02);
        dummy.updateMatrix();
        torso.setMatrixAt(i, dummy.matrix);

        dummy.position.set(a.x + jx, a.y + 0.78, a.z - side * 0.06);
        dummy.updateMatrix();
        head.setMatrixAt(i, dummy.matrix);

        dummy.position.set(a.x + jx, a.y + 0.28, a.z + courtDir * 0.16);
        dummy.updateMatrix();
        lap.setMatrixAt(i, dummy.matrix);

        c.set(SHIRTS[(row * STAND.seatsPerRow + seat + (side > 0 ? 0 : 7)) % SHIRTS.length]);
        torso.setColorAt(i, c);
        c.set(SKINS[(seat * 3 + row) % SKINS.length]);
        head.setColorAt(i, c);

        i++;
      }
    }
  }

  torso.instanceMatrix.needsUpdate = true;
  head.instanceMatrix.needsUpdate = true;
  lap.instanceMatrix.needsUpdate = true;

  group.add(torso, head, lap);
  return group;
}