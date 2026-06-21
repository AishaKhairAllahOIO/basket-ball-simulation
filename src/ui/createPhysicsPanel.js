import { physicsConfig } from "../physics/config/physicsConfig.js";

function formatValue(value, decimals = 3) {
  if (typeof value === "boolean") return value ? "تشغيل" : "إيقاف";
  return Number(value).toFixed(decimals).replace(/\.?0+$/, "");
}

function createPanelButton(panel) {
  const button = document.createElement("button");
  button.className = "physics-panel-toggle";
  button.textContent = "⚙ المتغيرات";

  button.addEventListener("click", () => {
    panel.classList.toggle("is-open");
  });

  document.body.appendChild(button);
}

function createSection(title, open = false) {
  const details = document.createElement("details");
  details.className = "control-section";
  details.open = open;

  const summary = document.createElement("summary");
  summary.textContent = title;

  details.appendChild(summary);

  return details;
}

function createRange({ label, unit = "", min, max, step, value, onInput }) {
  const wrapper = document.createElement("label");
  wrapper.className = "control-row";

  const top = document.createElement("div");
  top.className = "control-row__top";

  const title = document.createElement("span");
  title.textContent = label;

  const output = document.createElement("strong");
  output.textContent = `${formatValue(value)} ${unit}`;

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;

  input.addEventListener("input", () => {
    const nextValue = Number(input.value);
    output.textContent = `${formatValue(nextValue)} ${unit}`;
    onInput(nextValue);
  });

  top.append(title, output);
  wrapper.append(top, input);

  return wrapper;
}

function createToggle({ label, value, onInput }) {
  const wrapper = document.createElement("label");
  wrapper.className = "toggle-row";

  const text = document.createElement("span");
  text.textContent = label;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = value;

  input.addEventListener("change", () => {
    onInput(input.checked);
  });

  wrapper.append(text, input);

  return wrapper;
}

function updateBallRuntime(simulation) {
  const ball = simulation.ball;

  ball.mass = physicsConfig.ball.mass;
  ball.radius = physicsConfig.ball.radius;
  ball.inertia =
    physicsConfig.ball.inertiaFactor *
    ball.mass *
    ball.radius *
    ball.radius;
}

export function createPhysicsPanel({ simulation, onReset }) {
  const panel = document.createElement("aside");
  panel.className = "physics-panel";

  panel.innerHTML = `
    <div class="physics-panel__header">
      <h2>لوحة التحكم الفيزيائية</h2>
      <button class="physics-panel__close">×</button>
    </div>
    <p>
      القيم الافتراضية مضبوطة على النموذج الواقعي في التقرير.
      غيّري القيم ثم اضغطي تسديد أو إعادة.
    </p>
  `;

  panel.querySelector(".physics-panel__close").addEventListener("click", () => {
    panel.classList.remove("is-open");
  });

  const actions = document.createElement("div");
  actions.className = "panel-actions";

  const resetButton = document.createElement("button");
  resetButton.textContent = "إعادة";

  const shootButton = document.createElement("button");
  shootButton.textContent = "تسديد";
  shootButton.className = "primary";

  resetButton.addEventListener("click", onReset);
  shootButton.addEventListener("click", onReset);

  actions.append(resetButton, shootButton);
  panel.appendChild(actions);

  const enabled = createSection("تفعيل / تعطيل القوى", true);
  enabled.append(
    createToggle({
      label: "الجاذبية",
      value: physicsConfig.enabled.gravity,
      onInput: (v) => (physicsConfig.enabled.gravity = v),
    }),
    createToggle({
      label: "مقاومة الهواء Drag",
      value: physicsConfig.enabled.drag,
      onInput: (v) => (physicsConfig.enabled.drag = v),
    }),
    createToggle({
      label: "قوة ماغنوس Magnus",
      value: physicsConfig.enabled.magnus,
      onInput: (v) => (physicsConfig.enabled.magnus = v),
    }),
    createToggle({
      label: "قوة الطفو",
      value: physicsConfig.enabled.buoyancy,
      onInput: (v) => (physicsConfig.enabled.buoyancy = v),
    }),
    createToggle({
      label: "تصادم الأرض",
      value: physicsConfig.enabled.groundCollision,
      onInput: (v) => (physicsConfig.enabled.groundCollision = v),
    }),
    createToggle({
      label: "تصادم اللوحة",
      value: physicsConfig.enabled.backboardCollision,
      onInput: (v) => (physicsConfig.enabled.backboardCollision = v),
    }),
    createToggle({
      label: "تصادم الحافة",
      value: physicsConfig.enabled.rimCollision,
      onInput: (v) => (physicsConfig.enabled.rimCollision = v),
    }),
    createToggle({
      label: "قوة الشبكة",
      value: physicsConfig.enabled.netForce,
      onInput: (v) => (physicsConfig.enabled.netForce = v),
    }),
    createToggle({
      label: "منع الاختراق",
      value: physicsConfig.enabled.penetrationCorrection,
      onInput: (v) => (physicsConfig.enabled.penetrationCorrection = v),
    })
  );

  const launch = createSection("الإطلاق والدوران", true);
  launch.append(
    createRange({
      label: "زاوية الإطلاق θ",
      unit: "°",
      min: 20,
      max: 65,
      step: 1,
      value: physicsConfig.launch.angleDeg,
      onInput: (v) => (physicsConfig.launch.angleDeg = v),
    }),
    createRange({
      label: "السرعة الابتدائية v₀",
      unit: "m/s",
      min: 2,
      max: 14,
      step: 0.1,
      value: physicsConfig.launch.speed,
      onInput: (v) => (physicsConfig.launch.speed = v),
    }),
    createRange({
      label: "الانحراف الجانبي z₀",
      unit: "m",
      min: -1.2,
      max: 1.2,
      step: 0.05,
      value: physicsConfig.launch.sideOffset,
      onInput: (v) => (physicsConfig.launch.sideOffset = v),
    }),
    createRange({
      label: "Backspin",
      unit: "rev/s",
      min: 0,
      max: 14,
      step: 0.5,
      value: physicsConfig.launch.backspin,
      onInput: (v) => (physicsConfig.launch.backspin = v),
    }),
    createRange({
      label: "Topspin",
      unit: "rev/s",
      min: 0,
      max: 14,
      step: 0.5,
      value: physicsConfig.launch.topspin,
      onInput: (v) => (physicsConfig.launch.topspin = v),
    }),
    createRange({
      label: "Side Spin",
      unit: "rev/s",
      min: -10,
      max: 10,
      step: 0.5,
      value: physicsConfig.launch.sidespin,
      onInput: (v) => (physicsConfig.launch.sidespin = v),
    })
  );

  const ball = createSection("خصائص الكرة الواقعية", false);
  ball.append(
    createRange({
      label: "الكتلة m",
      unit: "kg",
      min: 0.51,
      max: 0.62,
      step: 0.01,
      value: physicsConfig.ball.mass,
      onInput: (v) => {
        physicsConfig.ball.mass = v;
        updateBallRuntime(simulation);
      },
    }),
    createRange({
      label: "نصف القطر R",
      unit: "m",
      min: 0.113,
      max: 0.123,
      step: 0.001,
      value: physicsConfig.ball.radius,
      onInput: (v) => {
        physicsConfig.ball.radius = v;
        updateBallRuntime(simulation);
      },
    }),
    createRange({
      label: "معامل العطالة λ",
      min: 0.4,
      max: 0.67,
      step: 0.01,
      value: physicsConfig.ball.inertiaFactor,
      onInput: (v) => {
        physicsConfig.ball.inertiaFactor = v;
        updateBallRuntime(simulation);
      },
    }),
    createRange({
      label: "تأثير الضغط الداخلي",
      min: 0.5,
      max: 1.5,
      step: 0.01,
      value: physicsConfig.ball.internalPressureEffect,
      onInput: (v) => (physicsConfig.ball.internalPressureEffect = v),
    }),
    createRange({
      label: "خشونة سطح الكرة",
      min: 0,
      max: 2,
      step: 0.01,
      value: physicsConfig.ball.surfaceRoughness,
      onInput: (v) => (physicsConfig.ball.surfaceRoughness = v),
    })
  );

  const environment = createSection("الهواء والجاذبية", false);
  environment.append(
    createRange({
      label: "الجاذبية g",
      unit: "m/s²",
      min: 1,
      max: 15,
      step: 0.01,
      value: physicsConfig.environment.gravity,
      onInput: (v) => (physicsConfig.environment.gravity = v),
    }),
    createRange({
      label: "كثافة الهواء ρ",
      unit: "kg/m³",
      min: 0,
      max: 2,
      step: 0.01,
      value: physicsConfig.environment.airDensity,
      onInput: (v) => (physicsConfig.environment.airDensity = v),
    }),
    createRange({
      label: "رياح X",
      unit: "m/s",
      min: -8,
      max: 8,
      step: 0.1,
      value: physicsConfig.environment.windX,
      onInput: (v) => (physicsConfig.environment.windX = v),
    }),
    createRange({
      label: "رياح Y",
      unit: "m/s",
      min: -4,
      max: 4,
      step: 0.1,
      value: physicsConfig.environment.windY,
      onInput: (v) => (physicsConfig.environment.windY = v),
    }),
    createRange({
      label: "رياح Z",
      unit: "m/s",
      min: -8,
      max: 8,
      step: 0.1,
      value: physicsConfig.environment.windZ,
      onInput: (v) => (physicsConfig.environment.windZ = v),
    })
  );

  const aerodynamics = createSection("السحب وماغنوس", false);
  aerodynamics.append(
    createRange({
      label: "معامل السحب Cd",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.aerodynamics.dragCoefficient,
      onInput: (v) => (physicsConfig.aerodynamics.dragCoefficient = v),
    }),
    createRange({
      label: "معامل ماغنوس S",
      min: 0,
      max: 0.01,
      step: 0.0001,
      value: physicsConfig.aerodynamics.magnusCoefficient,
      onInput: (v) => (physicsConfig.aerodynamics.magnusCoefficient = v),
    }),
    createRange({
      label: "مقاومة الدوران",
      min: 0,
      max: 0.02,
      step: 0.0005,
      value: physicsConfig.aerodynamics.angularDamping,
      onInput: (v) => (physicsConfig.aerodynamics.angularDamping = v),
    })
  );

  const collision = createSection("الارتداد والاحتكاك", false);
  collision.append(
    createRange({
      label: "ارتداد الأرض e_g",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.restitution.ground,
      onInput: (v) => (physicsConfig.restitution.ground = v),
    }),
    createRange({
      label: "ارتداد اللوحة e_b",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.restitution.backboard,
      onInput: (v) => (physicsConfig.restitution.backboard = v),
    }),
    createRange({
      label: "ارتداد الحافة e_r",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.restitution.rim,
      onInput: (v) => (physicsConfig.restitution.rim = v),
    }),
    createRange({
      label: "الاحتكاك الساكن μs",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.friction.static,
      onInput: (v) => (physicsConfig.friction.static = v),
    }),
    createRange({
      label: "الاحتكاك الحركي μk",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.friction.kinetic,
      onInput: (v) => (physicsConfig.friction.kinetic = v),
    }),
    createRange({
      label: "احتكاك الحافة",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.friction.rim,
      onInput: (v) => (physicsConfig.friction.rim = v),
    }),
    createRange({
      label: "احتكاك اللوحة",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.friction.backboard,
      onInput: (v) => (physicsConfig.friction.backboard = v),
    })
  );

  const contact = createSection("التشوه والتخميد ومنع الاختراق", false);
  contact.append(
    createRange({
      label: "معامل الصلابة k",
      unit: "N/m",
      min: 1000,
      max: 50000,
      step: 500,
      value: physicsConfig.contact.stiffness,
      onInput: (v) => (physicsConfig.contact.stiffness = v),
    }),
    createRange({
      label: "معامل التخميد c",
      unit: "N·s/m",
      min: 0,
      max: 500,
      step: 5,
      value: physicsConfig.contact.damping,
      onInput: (v) => (physicsConfig.contact.damping = v),
    }),
    createRange({
      label: "تصحيح الاختراق β",
      min: 0,
      max: 1,
      step: 0.01,
      value: physicsConfig.contact.penetrationCorrectionFactor,
      onInput: (v) => (physicsConfig.contact.penetrationCorrectionFactor = v),
    })
  );

  const geometry = createSection("أبعاد السلة واللوحة", false);
  geometry.append(
    createRange({
      label: "نصف قطر الحلقة",
      unit: "m",
      min: 0.225,
      max: 0.2295,
      step: 0.0005,
      value: physicsConfig.hoop.rimRadius,
      onInput: (v) => (physicsConfig.hoop.rimRadius = v),
    }),
    createRange({
      label: "نصف قطر معدن الحلقة",
      unit: "m",
      min: 0.008,
      max: 0.01,
      step: 0.0005,
      value: physicsConfig.hoop.rimTubeRadius,
      onInput: (v) => (physicsConfig.hoop.rimTubeRadius = v),
    }),
    createRange({
      label: "ارتفاع الحلقة",
      unit: "m",
      min: 2.8,
      max: 3.2,
      step: 0.01,
      value: physicsConfig.hoop.height,
      onInput: (v) => (physicsConfig.hoop.height = v),
    }),
    createRange({
      label: "عرض اللوحة",
      unit: "m",
      min: 1.4,
      max: 2.0,
      step: 0.01,
      value: physicsConfig.backboard.width,
      onInput: (v) => (physicsConfig.backboard.width = v),
    }),
    createRange({
      label: "ارتفاع اللوحة",
      unit: "m",
      min: 0.8,
      max: 1.3,
      step: 0.01,
      value: physicsConfig.backboard.height,
      onInput: (v) => (physicsConfig.backboard.height = v),
    })
  );

  const net = createSection("الشبكة", false);
  net.append(
    createRange({
      label: "طول الشبكة",
      unit: "m",
      min: 0.4,
      max: 0.45,
      step: 0.005,
      value: physicsConfig.net.height,
      onInput: (v) => (physicsConfig.net.height = v),
    }),
    createRange({
      label: "تخميد الشبكة",
      min: 0.9,
      max: 1,
      step: 0.001,
      value: physicsConfig.net.damping,
      onInput: (v) => (physicsConfig.net.damping = v),
    }),
    createRange({
      label: "التخميد الجانبي للشبكة",
      min: 0.9,
      max: 1,
      step: 0.001,
      value: physicsConfig.net.lateralDamping,
      onInput: (v) => (physicsConfig.net.lateralDamping = v),
    }),
    createRange({
      label: "نقاط تثبيت الشبكة",
      min: 8,
      max: 16,
      step: 1,
      value: physicsConfig.net.attachmentPoints,
      onInput: (v) => (physicsConfig.net.attachmentPoints = v),
    })
  );

  const integrator = createSection("التكامل العددي والاستقرار", false);
  integrator.append(
    createRange({
      label: "زمن الخطوة Δt",
      unit: "s",
      min: 1 / 240,
      max: 1 / 60,
      step: 0.001,
      value: physicsConfig.integrator.fixedTimestep,
      onInput: (v) => (physicsConfig.integrator.fixedTimestep = v),
    }),
    createRange({
      label: "عدد الخطوات الفرعية",
      min: 1,
      max: 16,
      step: 1,
      value: physicsConfig.integrator.maxSubSteps,
      onInput: (v) => (physicsConfig.integrator.maxSubSteps = v),
    }),
    createRange({
      label: "حد السرعة الأعلى",
      unit: "m/s",
      min: 5,
      max: 60,
      step: 1,
      value: physicsConfig.integrator.maxVelocity,
      onInput: (v) => (physicsConfig.integrator.maxVelocity = v),
    })
  );

  panel.append(
    enabled,
    launch,
    ball,
    environment,
    aerodynamics,
    collision,
    contact,
    geometry,
    net,
    integrator
  );

  document.body.appendChild(panel);
  createPanelButton(panel);

  return panel;
}