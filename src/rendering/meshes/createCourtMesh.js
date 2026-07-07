import * as THREE from "three";
import { CourtGeometry as COURT } from "../../physics/properties/CourtGeometry.js";

const COLORS = {
  outerGround: 0x7fc99e,
  freeZone: 0x2f3f9e,
  courtWood: 0xd8a63a,
  paint: 0x33b5c4,
  advertising: 0xa8d956,
  white: 0xffffff,
};

const textureLoader = new THREE.TextureLoader();

function prepareTexture(texture, repeatX = 1, repeatY = 1, isColor = false) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);

  if (isColor) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return texture;
}

function createTextureMaterial(folderPath, repeatX, repeatY, options = {}) {
  const colorMap = prepareTexture(
    textureLoader.load(`${folderPath}/color.png`),
    repeatX,
    repeatY,
    true
  );

  const aoMap = prepareTexture(
    textureLoader.load(`${folderPath}/ao.png`),
    repeatX,
    repeatY
  );

  const normalMap = prepareTexture(
    textureLoader.load(`${folderPath}/normal.png`),
    repeatX,
    repeatY
  );

  const roughnessMap = prepareTexture(
    textureLoader.load(`${folderPath}/roughness.png`),
    repeatX,
    repeatY
  );

  return new THREE.MeshStandardMaterial({
    map: colorMap,
    aoMap,
    normalMap,
    roughnessMap,
    roughness: 0.72,
    metalness: 0,
    ...options,
  });
}

function addUv2(geometry) {
  if (geometry.attributes.uv) {
    geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    );
  }

  return geometry;
}

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.62,
    metalness: 0.02,
    ...options,
  });
}

function line(points, color = COLORS.white) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95,
    })
  );
}

function rectangleLine(x1, x2, z1, z2, y = 0.08) {
  return line([
    new THREE.Vector3(x1, y, z1),
    new THREE.Vector3(x2, y, z1),
    new THREE.Vector3(x2, y, z2),
    new THREE.Vector3(x1, y, z2),
    new THREE.Vector3(x1, y, z1),
  ]);
}

function arc({ cx, cz = 0, radius, start, end, y = 0.09, segments = 128 }) {
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = start + (end - start) * t;

    points.push(
      new THREE.Vector3(
        cx + Math.cos(a) * radius,
        y,
        cz + Math.sin(a) * radius
      )
    );
  }

  return line(points);
}

function circle(cx, cz, radius) {
  return arc({
    cx,
    cz,
    radius,
    start: 0,
    end: Math.PI * 2,
    segments: 180,
  });
}

function filledRect(width, depth, x, z, color, opacity = 1, y = 0.035) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.045, depth),
    material(color, {
      transparent: opacity < 1,
      opacity,
    })
  );

  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;

  return mesh;
}

function createThinMark({ width, depth, x, z, color = COLORS.white }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.025, depth),
    material(color)
  );

  mesh.position.set(x, 0.095, z);
  mesh.receiveShadow = true;

  return mesh;
}

function createLabelTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  ctx.fillStyle = "#111111";
  ctx.font = "bold 42px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function labelPlane({ text, width, depth, x, z, y = 0.09 }) {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({
      map: createLabelTexture(text),
    })
  );

  plane.rotation.x = -Math.PI / 2;
  plane.position.set(x, y, z);

  return plane;
}

function createThreePointLine(side) {
  const group = new THREE.Group();

  const halfLength = COURT.length / 2;
  const basketX = side * (halfLength - COURT.basketCenterFromEndLine);

  const z = COURT.threePointSideZ;
  const r = COURT.threePointRadius;

  const dx = Math.sqrt(r * r - z * z);

  const endLineX = side * halfLength;
  const tangentX = basketX - side * dx;

  group.add(
    line([
      new THREE.Vector3(endLineX, 0.1, z),
      new THREE.Vector3(tangentX, 0.1, z),
    ])
  );

  group.add(
    line([
      new THREE.Vector3(endLineX, 0.1, -z),
      new THREE.Vector3(tangentX, 0.1, -z),
    ])
  );

  const tangentAngle = Math.atan2(z, tangentX - basketX);

  if (side > 0) {
    group.add(
      arc({
        cx: basketX,
        radius: r,
        start: tangentAngle,
        end: Math.PI * 2 - tangentAngle,
        segments: 180,
      })
    );
  } else {
    group.add(
      arc({
        cx: basketX,
        radius: r,
        start: -tangentAngle,
        end: tangentAngle,
        segments: 180,
      })
    );
  }

  return group;
}

function createLaneHashMarks(side) {
  const group = new THREE.Group();

  const halfLength = COURT.length / 2;
  const endLineX = side * halfLength;
  const laneHalf = COURT.restrictedAreaWidth / 2;

  const markXsFromEndLine = [1.75, 2.85, 3.95, 5.05];

  for (const distance of markXsFromEndLine) {
    const x = endLineX - side * distance;

    group.add(
      createThinMark({
        width: 0.08,
        depth: COURT.laneMarkLength,
        x,
        z: laneHalf + COURT.laneMarkLength / 2,
      })
    );

    group.add(
      createThinMark({
        width: 0.08,
        depth: COURT.laneMarkLength,
        x,
        z: -laneHalf - COURT.laneMarkLength / 2,
      })
    );
  }

  return group;
}

function createHalfCourt(side) {
  const group = new THREE.Group();

  const halfLength = COURT.length / 2;
  const endLineX = side * halfLength;
  const basketX = side * (halfLength - COURT.basketCenterFromEndLine);
  const freeThrowX = side * (halfLength - COURT.freeThrowLineFromEndLine);

  const laneHalf = COURT.restrictedAreaWidth / 2;

  group.add(
    filledRect(
      COURT.freeThrowLineFromEndLine,
      COURT.restrictedAreaWidth,
      side * (halfLength - COURT.freeThrowLineFromEndLine / 2),
      0,
      COLORS.paint,
      0.82
    )
  );

  group.add(rectangleLine(endLineX, freeThrowX, -laneHalf, laneHalf));

  if (side > 0) {
    group.add(
      arc({
        cx: freeThrowX,
        radius: COURT.freeThrowCircleRadius,
        start: Math.PI / 2,
        end: Math.PI * 1.5,
      })
    );

    group.add(
      arc({
        cx: basketX,
        radius: COURT.noChargeRadius,
        start: Math.PI / 2,
        end: Math.PI * 1.5,
        segments: 80,
      })
    );
  } else {
    group.add(
      arc({
        cx: freeThrowX,
        radius: COURT.freeThrowCircleRadius,
        start: -Math.PI / 2,
        end: Math.PI / 2,
      })
    );

    group.add(
      arc({
        cx: basketX,
        radius: COURT.noChargeRadius,
        start: -Math.PI / 2,
        end: Math.PI / 2,
        segments: 80,
      })
    );
  }

  group.add(createThreePointLine(side));
  group.add(circle(basketX, 0, 0.08));
  group.add(createLaneHashMarks(side));

  return group;
}

function createSurroundingFibaZones() {
  const group = new THREE.Group();

  const halfLength = COURT.length / 2;
  const halfWidth = COURT.width / 2;

  const freeOuterLength = COURT.length + COURT.freeZone * 2;
  const freeOuterWidth = COURT.width + COURT.freeZone * 2;

  const boardMat = material(COLORS.advertising);

  const topBoardZ =
    -halfWidth - COURT.freeZone - COURT.advertisingBoardDepth / 2;

  const bottomBoundaryZ = halfWidth + COURT.freeZone + 0.42;

  const sideBoardX =
    halfLength + COURT.freeZone + COURT.advertisingBoardDepth / 2;

  const topBoardY = 0.08;

  const leftTopAd = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.08, COURT.advertisingBoardDepth),
    boardMat
  );
  leftTopAd.position.set(-9.4, topBoardY, topBoardZ);

  const centerAd = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 0.08, COURT.advertisingBoardDepth),
    boardMat
  );
  centerAd.position.set(0, topBoardY, topBoardZ);

  const rightTopAd = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.08, COURT.advertisingBoardDepth),
    boardMat
  );
  rightTopAd.position.set(9.4, topBoardY, topBoardZ);

  const leftSideUpper = new THREE.Mesh(
    new THREE.BoxGeometry(COURT.advertisingBoardDepth, 0.08, 3.9),
    boardMat
  );
  leftSideUpper.position.set(-sideBoardX, topBoardY, -4.8);

  const leftSideLower = leftSideUpper.clone();
  leftSideLower.position.z = 4.8;

  const rightSideUpper = leftSideUpper.clone();
  rightSideUpper.position.x = sideBoardX;

  const rightSideLower = leftSideLower.clone();
  rightSideLower.position.x = sideBoardX;

  group.add(
    leftTopAd,
    centerAd,
    rightTopAd,
    leftSideUpper,
    leftSideLower,
    rightSideUpper,
    rightSideLower
  );

  group.add(
    labelPlane({
      text: "Team bench",
      width: 4.2,
      depth: 0.45,
      x: -8.5,
      z: topBoardZ - 0.9,
    })
  );

  group.add(
    labelPlane({
      text: "Scorer's table",
      width: 4.4,
      depth: 0.65,
      x: 0,
      z: topBoardZ - 0.95,
    })
  );

  group.add(
    labelPlane({
      text: "Team bench",
      width: 4.2,
      depth: 0.45,
      x: 8.5,
      z: topBoardZ - 0.9,
    })
  );

  group.add(
    rectangleLine(
      -freeOuterLength / 2,
      freeOuterLength / 2,
      -freeOuterWidth / 2,
      freeOuterWidth / 2,
      0.07
    )
  );

  return group;
}
function createCourtGlowBorder() {
  const group = new THREE.Group();
  group.name = "Court_Glow_Border";

  const outerLength = COURT.length + COURT.freeZone * 2;
  const outerWidth = COURT.width + COURT.freeZone * 2;

  const glowColor = 0xffff88;        // ← أزرق فاتح متوهج (كان 0xffff88 أصفر)
  const stripWidth = 0.12;           // ← أعرض شوي (كان 0.08)
  const y = 0.06;                    // ← ارفعيه فوق الحافة الزرقاء عشان يبان

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 1.0,                    // ← أقوى (كان 0.95)
  });

  const softGlowMaterial = new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.45,                   // ← هالة أوضح (كان 0.28)
    depthWrite: false,
  });

  function addStrip(width, depth, x, z) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.02, depth),
      glowMaterial
    );
    strip.position.set(x, y, z);

    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.5, 0.01, depth + 0.5),
      softGlowMaterial
    );
    glow.position.set(x, y - 0.004, z);

    group.add(glow, strip);
  }

  const halfL = outerLength / 2;
  const halfW = outerWidth / 2;

  addStrip(outerLength, stripWidth, 0, -halfW);
  addStrip(outerLength, stripWidth, 0, halfW);
  addStrip(stripWidth, outerWidth, -halfL, 0);
  addStrip(stripWidth, outerWidth, halfL, 0);

  // أضواء نقطية موزعة على الحواف عشان التوهج يضيء الأرض
  const cornerLights = [
    [halfL, -halfW], [halfL, halfW],
    [-halfL, -halfW], [-halfL, halfW],
    [0, -halfW], [0, halfW],
  ];

  for (const [x, z] of cornerLights) {
    const pointLight = new THREE.PointLight(glowColor, 2.5, 15, 2);
    pointLight.position.set(x, 0.5, z);
    group.add(pointLight);
  }

  return group;
}
export function createCourtMesh() {

  const group = new THREE.Group();
  group.name = "FIBA_Official_Court_With_Textures";

  const halfLength = COURT.length / 2;
  const halfWidth = COURT.width / 2;

  
  const freeZone = new THREE.Mesh(
    new THREE.BoxGeometry(
      COURT.length + COURT.freeZone * 2,
      0.05,                              // ← كان 0.025، خليناه أسمك
      COURT.width + COURT.freeZone * 2
    ),
    material(COLORS.freeZone, {
      roughness: 0.7,
      metalness: 0.01,
    })
  );

  freeZone.position.y = 0.01;            // ← كان -0.035، رفعناه فوق العشب
  freeZone.receiveShadow = true;

  const courtGeometry = addUv2(
    new THREE.BoxGeometry(COURT.length, 0.045, COURT.width)
  );

  const court = new THREE.Mesh(
    courtGeometry,
    createTextureMaterial("/texture/WoodFloor", 5, 3, {
      roughness: 0.5,
      metalness: 0.02,
    })
  );

    court.position.y = 0.02;

  court.receiveShadow = true;

  group.add( freeZone, court);

  group.add(rectangleLine(-halfLength, halfLength, -halfWidth, halfWidth));

  group.add(
    line([
      new THREE.Vector3(0, 0.09, -halfWidth),
      new THREE.Vector3(0, 0.09, halfWidth),
    ])
  );

  group.add(circle(0, 0, COURT.centerCircleRadius));
  group.add(createHalfCourt(1));
  group.add(createHalfCourt(-1));
  group.add(createSurroundingFibaZones());
  group.add(createCourtGlowBorder());

  return group;
}