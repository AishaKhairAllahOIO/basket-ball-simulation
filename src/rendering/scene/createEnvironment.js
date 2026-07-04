import * as THREE from "three";

const ENV = {
  length: 54,
  width: 42,
  wallHeight: 8,
  wallThickness: 0.4,
};

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.02,
    ...options,
  });
}

function createWalls() {
  const group = new THREE.Group();
  group.name = "Indoor_Arena_Walls";

  const wallMaterial = mat(0x181a1d);
  const trimMaterial = mat(0x5c4a35);

  const L = ENV.length;
  const W = ENV.width;
  const H = ENV.wallHeight;
  const T = ENV.wallThickness;

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(L, H, T), wallMaterial);
  backWall.position.set(0, H / 2, -W / 2);

  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(L, H, T), wallMaterial);
  frontWall.position.set(0, H / 2, W / 2);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(T, H, W), wallMaterial);
  leftWall.position.set(-L / 2, H / 2, 0);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(T, H, W), wallMaterial);
  rightWall.position.set(L / 2, H / 2, 0);

  const backTrim = new THREE.Mesh(new THREE.BoxGeometry(L, 0.28, 0.5), trimMaterial);
  backTrim.position.set(0, H + 0.12, -W / 2);

  const frontTrim = backTrim.clone();
  frontTrim.position.z = W / 2;

  const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, W), trimMaterial);
  leftTrim.position.set(-L / 2, H + 0.12, 0);

  const rightTrim = leftTrim.clone();
  rightTrim.position.x = L / 2;

  group.add(
    backWall,
    frontWall,
    leftWall,
    rightWall,
    backTrim,
    frontTrim,
    leftTrim,
    rightTrim
  );

  return group;
}

function createWallLamp(x, z, rotationY = 0) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.22, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.45,
      metalness: 0.35,
      emissive: 0xffd28a,
      emissiveIntensity: 0.4,
    })
  );

  body.position.set(x, 5.8, z);
  body.rotation.y = rotationY;

  const light = new THREE.SpotLight(0xffdca3, 2.3, 17, Math.PI / 5, 0.55, 1.2);
  light.position.set(x, 5.7, z);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);

  const target = new THREE.Object3D();
  target.position.set(x * 0.75, 1.2, z * 0.75);
  light.target = target;

  group.add(body, target, light);

  return group;
}

function createWallLights() {
  const group = new THREE.Group();

  for (let x = -20; x <= 20; x += 8) {
    group.add(createWallLamp(x, -20.8, 0));
    group.add(createWallLamp(x, 20.8, Math.PI));
  }

  for (let z = -14; z <= 14; z += 8) {
    group.add(createWallLamp(-26.8, z, Math.PI / 2));
    group.add(createWallLamp(26.8, z, -Math.PI / 2));
  }

  return group;
}

function createSkyBand() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#1e293b");
  gradient.addColorStop(0.35, "#475569");
  gradient.addColorStop(0.58, "#f97316");
  gradient.addColorStop(0.72, "#facc15");
  gradient.addColorStop(1, "#334155");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 14),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
  );

  sky.name = "Sunset_Sky_Backdrop";
  sky.position.set(0, 10.5, -22.5);

  return sky;
}

function createSoftCeilingLight() {
  const light = new THREE.RectAreaLight(0xffffff, 3.2, 32, 20);
  light.position.set(0, 8.5, 0);
  light.rotation.x = -Math.PI / 2;
  return light;
}

export function createEnvironment(scene) {
  const environment = new THREE.Group();
  environment.name = "Basketball_Indoor_Environment";

  scene.background = new THREE.Color(0x9dccf4);
  scene.fog = null;

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);

  const hemi = new THREE.HemisphereLight(0xbfdfff, 0x1b1b1b, 0.7);

  const mainLight = new THREE.DirectionalLight(0xfff1d6, 1.5);
  mainLight.position.set(12, 18, 8);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.set(2048, 2048);

  environment.add(createSkyBand());
  environment.add(createWalls());
  environment.add(createWallLights());
  environment.add(createSoftCeilingLight());

  scene.add(ambient);
  scene.add(hemi);
  scene.add(mainLight);
  scene.add(environment);

  return environment;
}