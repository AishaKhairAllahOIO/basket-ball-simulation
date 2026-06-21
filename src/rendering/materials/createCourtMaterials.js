import * as THREE from "three";

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#d9a441";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 80; i++) {
    const x = i * 14 + Math.random() * 8;

    ctx.fillStyle = i % 2 === 0 ? "#e8bd5a" : "#c98d32";
    ctx.fillRect(x, 0, 10 + Math.random() * 10, canvas.height);

    ctx.strokeStyle = "rgba(90, 45, 10, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(i) * 20, canvas.height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

export function createCourtMaterials() {
  const woodTexture = createWoodTexture();

  return {
    floor: new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.45,
      metalness: 0.05,
    }),

    line: new THREE.LineBasicMaterial({
      color: 0xffffff,
    }),

    paintArea: new THREE.MeshStandardMaterial({
      color: 0x6fd38d,
      transparent: true,
      opacity: 0.55,
      roughness: 0.6,
    }),

    outerGround: new THREE.MeshStandardMaterial({
      color: 0x4caf62,
      roughness: 0.9,
    }),
  };
}