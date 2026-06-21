import * as THREE from "three";

const LIGHT_POLES = [
  { x: -15.5, z: -10.8, targetX: -7, targetZ: -3 },
  { x: 15.5, z: -10.8, targetX: 7, targetZ: -3 },
  { x: -15.5, z: 10.8, targetX: -7, targetZ: 3 },
  { x: 15.5, z: 10.8, targetX: 7, targetZ: 3 },
];

function createPole({ x, z, targetX, targetZ }) {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.055, 5.2, 20),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.5,
    })
  );

  pole.position.y = 2.6;
  pole.castShadow = true;

  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.1, 12),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.45,
    })
  );

  arm.position.set(0, 5.0, -0.35);
  arm.rotation.x = Math.PI / 2;
  arm.castShadow = true;

  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.22, 0.38),
    new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.35,
    })
  );

  lamp.position.set(0, 5.0, -0.9);
  lamp.castShadow = true;

  const lightFace = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.03, 0.28),
    new THREE.MeshStandardMaterial({
      color: 0xfff4c7,
      emissive: 0xffe4a3,
      emissiveIntensity: 1.5,
    })
  );

  lightFace.position.set(0, 4.88, -0.9);

  const spot = new THREE.SpotLight(0xffffff, 2.8, 26, Math.PI / 6, 0.45, 1.2);
  spot.position.set(x, 5.0, z);

  spot.target.position.set(targetX, 0, targetZ);
  spot.castShadow = true;

  spot.shadow.mapSize.width = 1024;
  spot.shadow.mapSize.height = 1024;

  group.add(pole, arm, lamp, lightFace);
  group.position.set(x, 0, z);

  group.lookAt(targetX, 0, targetZ);

  const lightGroup = new THREE.Group();
  lightGroup.add(group, spot, spot.target);

  return lightGroup;
}

export function createLightPolesMesh() {
  const group = new THREE.Group();
  group.name = "OuterLightPoles";

  for (const pole of LIGHT_POLES) {
    group.add(createPole(pole));
  }

  return group;
}