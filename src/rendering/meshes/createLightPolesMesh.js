import * as THREE from "three";

function createPole(x, z) {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 3.8, 16),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.45,
    })
  );
  pole.position.y = 1.9;
  pole.castShadow = true;

  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.22, 0.28),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
    })
  );
  lamp.position.set(0, 3.85, 0);

  const light = new THREE.SpotLight(0xffffff, 4, 10, Math.PI / 5, 0.45, 1);
  light.position.set(0, 3.7, 0);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;

  group.add(pole, lamp, light, light.target);
  group.position.set(x, 0, z);

  return group;
}

export function createLightPolesMesh() {
  const group = new THREE.Group();
  group.name = "LightPoles";

  group.add(createPole(-4.5, -3.8));
  group.add(createPole(-4.5, 3.8));
  group.add(createPole(4.4, -3.8));
  group.add(createPole(4.4, 3.8));

  return group;
}