import * as THREE from "three";

// ===== أبعاد الملعب المرجعية (للتموضع فقط، ليست فيزياء) =====
const COURT = {
  halfLength: 14,
  halfWidth: 7.5,
  freeZone: 2,
};

// ===== تخطيط المدرّج (مصدر واحد يشاركه الجمهور) =====
export const STAND = {
  rows: 9,
  seatsPerRow: 46,
  seatWidth: 0.5,
  rowRise: 0.42, // ارتفاع الدرجة
  rowDepth: 0.92, // عمق الدرجة
  baseY: 0.25, // ارتفاع أول صف
  frontGap: 0.7, // فجوة عن حافة المنطقة الحرة
};

STAND.width = STAND.seatsPerRow * STAND.seatWidth;
STAND.frontZ = COURT.halfWidth + COURT.freeZone + STAND.frontGap;

// موضع مركز أي مقعد (side = ±1, row, seat)
export function seatAnchor(side, row, seat) {
  const x = -STAND.width / 2 + STAND.seatWidth / 2 + seat * STAND.seatWidth;
  const y = STAND.baseY + row * STAND.rowRise;
  const z = side * (STAND.frontZ + row * STAND.rowDepth);
  return { x, y, z };
}

function mat(color, roughness = 0.85, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

// ===== الأرضية الخضراء (كما كانت) =====
const textureLoader = new THREE.TextureLoader();
const grassColor = textureLoader.load("/texture/Grass/color.png");
grassColor.wrapS = THREE.RepeatWrapping;
grassColor.wrapT = THREE.RepeatWrapping;
grassColor.repeat.set(80, 80);
grassColor.colorSpace = THREE.SRGBColorSpace;

const groundGeometry = new THREE.PlaneGeometry(500, 500);
groundGeometry.rotateX(-Math.PI / 2);

// ===== الهيكل المتدرّج لجهة واحدة =====
function createStandStructure(side) {
  const group = new THREE.Group();

  const deckMat = mat(0x8f98a3, 0.9); // خرسانة فاتحة
  const riserMat = mat(0x39434f, 0.85); // واجهة الدرجة الداكنة
  const wallMat = mat(0x222c37, 0.9); // جدران المدرّج
  const railMat = mat(0xb23a26, 0.5, 0.1); // حاجز أمامي

  const totalDepth = STAND.rows * STAND.rowDepth;
  const totalRise = STAND.rows * STAND.rowRise;

  for (let i = 0; i < STAND.rows; i++) {
    const y = STAND.baseY + i * STAND.rowRise;
    const z = side * (STAND.frontZ + i * STAND.rowDepth);

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(STAND.width + 0.5, 0.12, STAND.rowDepth),
      deckMat
    );
    deck.position.set(0, y, z);
    deck.receiveShadow = true;
    group.add(deck);

    const riser = new THREE.Mesh(
      new THREE.BoxGeometry(STAND.width + 0.5, STAND.rowRise, 0.08),
      riserMat
    );
    riser.position.set(
      0,
      y - STAND.rowRise / 2 + 0.06,
      z - side * STAND.rowDepth / 2
    );
    riser.receiveShadow = true;
    group.add(riser);
  }

  // جدار خلفي
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(STAND.width + 0.7, totalRise + 0.7, 0.18),
    wallMat
  );
  backWall.position.set(
    0,
    STAND.baseY + totalRise / 2,
    side * (STAND.frontZ + totalDepth)
  );
  backWall.receiveShadow = true;
  group.add(backWall);

  // جداران جانبيان
  for (const sx of [-1, 1]) {
    const sideWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, totalRise + 0.5, totalDepth + 0.2),
      wallMat
    );
    sideWall.position.set(
      sx * (STAND.width / 2 + 0.3),
      STAND.baseY + totalRise / 2 - 0.1,
      side * (STAND.frontZ + totalDepth / 2 - STAND.rowDepth / 2)
    );
    sideWall.receiveShadow = true;
    group.add(sideWall);
  }

  // حاجز أمامي بين الملعب والمدرّج
  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(STAND.width + 0.5, 0.85, 0.12),
    railMat
  );
  rail.position.set(0, STAND.baseY + 0.25, side * (STAND.frontZ - 0.55));
  rail.castShadow = true;
  group.add(rail);

  return group;
}

// ===== المقاعد الفردية (InstancedMesh: نداء رسم واحد) =====
function createSeats() {
  const count = STAND.rows * STAND.seatsPerRow * 2;

  const padGeo = new THREE.BoxGeometry(STAND.seatWidth * 0.82, 0.06, 0.4);
  const backGeo = new THREE.BoxGeometry(STAND.seatWidth * 0.82, 0.34, 0.05);

  const padMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.05 });
  const backMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.05 });

  const pads = new THREE.InstancedMesh(padGeo, padMat, count);
  const backs = new THREE.InstancedMesh(backGeo, backMat, count);

  pads.receiveShadow = true;
  backs.receiveShadow = true;
  pads.frustumCulled = false;
  backs.frustumCulled = false;

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const bandA = new THREE.Color(0x1b3a63); // أزرق داكن
  const bandB = new THREE.Color(0xb23a26); // نطاق أحمر

  let i = 0;
  for (const side of [1, -1]) {
    for (let row = 0; row < STAND.rows; row++) {
      for (let seat = 0; seat < STAND.seatsPerRow; seat++) {
        const a = seatAnchor(side, row, seat);

        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.position.set(a.x, a.y + 0.18, a.z + side * 0.02);
        dummy.updateMatrix();
        pads.setMatrixAt(i, dummy.matrix);

        dummy.rotation.set(-side * 0.12, 0, 0);
        dummy.position.set(a.x, a.y + 0.36, a.z + side * 0.2);
        dummy.updateMatrix();
        backs.setMatrixAt(i, dummy.matrix);

        color.copy(row % 3 === 2 ? bandB : bandA);
        pads.setColorAt(i, color);
        backs.setColorAt(i, color);

        i++;
      }
    }
  }

  pads.instanceMatrix.needsUpdate = true;
  backs.instanceMatrix.needsUpdate = true;

  const group = new THREE.Group();
  group.name = "Stand_Seats";
  group.add(pads, backs);
  return group;
}

export function createArenaMesh() {
  const group = new THREE.Group();
  group.name = "FIBA_Arena_Bleachers";

  const ground = new THREE.Mesh(
    groundGeometry,
    new THREE.MeshStandardMaterial({
      map: grassColor,
      roughness: 0.9,
      metalness: 0.0,
    })
  );
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  group.add(ground);

  group.add(createStandStructure(1));
  group.add(createStandStructure(-1));
  group.add(createSeats());
  group.add(createEnclosure());

  return group;
}

// ===== الجدار المحيط + إنارة الجدران =====
const ENCLOSURE = {
  halfX: 22,
  halfZ: 20,
  height: 4.2,
  thickness: 0.4,
  color: 0x2b3039,
};

// وحدة إنارة مثبّتة على الجدار تصوّب للأسفل والداخل
function addDownlight(group, x, y, z, targetX, targetZ) {
  const fixture = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.2, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffe6b0, roughness: 0.4 })
  );
  fixture.position.set(x, y, z);
  group.add(fixture);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.32, 0.22),
    new THREE.MeshStandardMaterial({
      color: 0xfff2d0,
      emissive: 0xffe6b0,
      emissiveIntensity: 2.5,
    })
  );
  face.rotation.x = -Math.PI / 2; // موجّه للأسفل
  face.position.set(x, y - 0.11, z);
  group.add(face);

  // شدة/عدد الأضواء قابلة للضبط — قلّليها لو ثقل الأداء
  const spot = new THREE.SpotLight(0xfff2d5, 45, 18, Math.PI / 5, 0.5, 1.5);
  spot.position.set(x, y, z);
  spot.target.position.set(targetX, 0, targetZ);
  spot.castShadow = false;
  group.add(spot, spot.target);
}

function createEnclosure() {
  const group = new THREE.Group();
  group.name = "Arena_Enclosure";

  const { halfX, halfZ, height, thickness, color } = ENCLOSURE;
  const wallMat = mat(color, 0.85);

  // الجدران الأربعة
  const longWall = new THREE.BoxGeometry(halfX * 2 + thickness, height, thickness);
  const shortWall = new THREE.BoxGeometry(thickness, height, halfZ * 2 + thickness);

  const north = new THREE.Mesh(longWall, wallMat);
  north.position.set(0, height / 2, -halfZ);
  north.receiveShadow = true;

  const south = north.clone();
  south.position.z = halfZ;

  const west = new THREE.Mesh(shortWall, wallMat);
  west.position.set(-halfX, height / 2, 0);
  west.receiveShadow = true;

  const east = west.clone();
  east.position.x = halfX;

  group.add(north, south, west, east);

  const lightY = height - 0.5;
  const inward = 7; // كم يدخل مخروط الضوء نحو المركز

  // جداران طويلان (±Z): 5 أضواء لكل جدار
  const longXs = [-16, -8, 0, 8, 16];
  for (const x of longXs) {
    addDownlight(group, x, lightY, -halfZ + 0.3, x, -halfZ + inward);
    addDownlight(group, x, lightY, halfZ - 0.3, x, halfZ - inward);
  }

  // جداران قصيران (±X): 4 أضواء لكل جدار
  const shortZs = [-12, -4, 4, 12];
  for (const z of shortZs) {
    addDownlight(group, -halfX + 0.3, lightY, z, -halfX + inward, z);
    addDownlight(group, halfX - 0.3, lightY, z, halfX - inward, z);
  }

  return group;
}