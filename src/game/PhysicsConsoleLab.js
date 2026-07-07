import { Basketball } from "../physics/bodies/Basketball.js";
import { PhysicsWorld } from "../physics/simulation/PhysicsWorld.js";
import { SimulationDiagnostics } from "../physics/diagnostics/SimulationDiagnostics.js";

let currentOverrides = {};

function deepMerge(base, override = {}) {
  const result = { ...base };

  for (const key in override) {
    if (
      override[key] &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(base[key] ?? {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }

  return result;
}

function run({ overrides = {}, steps = 120, dt = 1 / 120 } = {}) {
  const ball = new Basketball();

  currentOverrides = deepMerge(currentOverrides, overrides);

  const world = new PhysicsWorld(ball, currentOverrides);
  const rows = [];

  for (let i = 0; i < steps; i++) {
    world.step(dt);

    rows.push({
      t: Number((i * dt).toFixed(3)),

      x: Number(ball.position.x.toFixed(3)),
      y: Number(ball.position.y.toFixed(3)),
      z: Number(ball.position.z.toFixed(3)),

      vx: Number(ball.v.x.toFixed(3)),
      vy: Number(ball.v.y.toFixed(3)),
      vz: Number(ball.v.z.toFixed(3)),
      speed: Number(ball.v.length().toFixed(3)),

      ax: Number(ball.a.x.toFixed(3)),
      ay: Number(ball.a.y.toFixed(3)),
      az: Number(ball.a.z.toFixed(3)),

      omega: Number(ball.omega.length().toFixed(3)),
      energy: Number((world.lastEnergyAnalysis?.current?.E ?? 0).toFixed(3)),

      ground: ball.touchedGround,
      rim: ball.touchedRim,
      backboard: ball.touchedBackboard,
      score: ball.hasScored,
    });
  }

  console.table(rows);

  return {
    ball,
    world,
    rows,
    diagnostics: SimulationDiagnostics(ball, world.config, world),
    overrides: currentOverrides,
  };
}

function resetOverrides() {
  currentOverrides = {};
  console.log("PhysicsLab overrides cleared.");
}

function setEnabled(name, enabled) {
  return run({
    overrides: {
      enabled: {
        [name]: enabled,
      },
    },
  });
}

function setManyEnabled(flags) {
  return run({
    overrides: {
      enabled: flags,
    },
  });
}

function showOverrides() {
  console.log("Current PhysicsLab overrides:");
  console.dir(currentOverrides);
  return currentOverrides;
}

function help() {
  console.group("🧪 PhysicsLab Help");

  console.log("Basic:");
  console.table([
    { command: "PhysicsLab.run()", purpose: "Run current experiment" },
    { command: "PhysicsLab.resetOverrides()", purpose: "Clear all overrides" },
    { command: "PhysicsLab.showOverrides()", purpose: "Show active overrides" },
    { command: "PhysicsLab.custom(overrides, steps)", purpose: "Advanced custom test" },
  ]);

  console.log("Environment:");
  console.table([
    { command: "PhysicsLab.gravity(15)", changes: "environment.g" },
    { command: "PhysicsLab.airDensity(1.4)", changes: "environment.air.rho" },
    { command: "PhysicsLab.wind(3, 0, 0)", changes: "environment.air.wind" },
  ]);

  console.log("Aerodynamics:");
  console.table([
    { command: "PhysicsLab.drag(0.9)", changes: "ball.aerodynamics.Cd" },
    { command: "PhysicsLab.lift(0.3)", changes: "ball.aerodynamics.Cl" },
    { command: "PhysicsLab.magnus(0.004)", changes: "ball.aerodynamics.magnusCoefficient" },
    { command: "PhysicsLab.angularDamping(0.01)", changes: "ball.aerodynamics.angularDampingCoefficient" },
  ]);

  console.log("Enable / Disable Forces:");
  console.table([
    { command: "PhysicsLab.enable('gravity')", force: "Gravity" },
    { command: "PhysicsLab.disable('gravity')", force: "Gravity" },
    { command: "PhysicsLab.enable('drag')", force: "Aerodynamic drag" },
    { command: "PhysicsLab.disable('drag')", force: "Aerodynamic drag" },
    { command: "PhysicsLab.enable('magnus')", force: "Magnus effect" },
    { command: "PhysicsLab.disable('magnus')", force: "Magnus effect" },
    { command: "PhysicsLab.enable('buoyancy')", force: "Buoyancy" },
    { command: "PhysicsLab.disable('buoyancy')", force: "Buoyancy" },
    { command: "PhysicsLab.enable('normalForce')", force: "Normal force" },
    { command: "PhysicsLab.disable('normalForce')", force: "Normal force" },
    { command: "PhysicsLab.enable('staticFriction')", force: "Static friction" },
    { command: "PhysicsLab.disable('staticFriction')", force: "Static friction" },
    { command: "PhysicsLab.enable('kineticFriction')", force: "Kinetic friction" },
    { command: "PhysicsLab.disable('kineticFriction')", force: "Kinetic friction" },
    { command: "PhysicsLab.enable('rollingResistance')", force: "Rolling resistance" },
    { command: "PhysicsLab.disable('rollingResistance')", force: "Rolling resistance" },
    { command: "PhysicsLab.enable('angularDamping')", force: "Angular damping" },
    { command: "PhysicsLab.disable('angularDamping')", force: "Angular damping" },
    { command: "PhysicsLab.enable('netResistance')", force: "Net resistance" },
    { command: "PhysicsLab.disable('netResistance')", force: "Net resistance" },
  ]);

  console.log("Collision System:");
  console.table([
    { command: "PhysicsLab.noCollisions()", purpose: "Disable full contact system" },
    { command: "PhysicsLab.collisions(true)", purpose: "Enable collision response" },
    { command: "PhysicsLab.ccd(true)", purpose: "Enable continuous collision detection" },
    { command: "PhysicsLab.restitution('ground', 0.9)", changes: "ground bounce" },
    { command: "PhysicsLab.restitution('rim', 0.4)", changes: "rim bounce" },
    { command: "PhysicsLab.restitution('backboard', 0.7)", changes: "backboard bounce" },
  ]);

  console.log("Friction / Contact Parameters:");
  console.table([
    { command: "PhysicsLab.friction(0.9, 0.6)", changes: "muS, muK" },
    { command: "PhysicsLab.ground(20000, 120)", changes: "ground stiffness/damping" },
    { command: "PhysicsLab.rim(25000, 150)", changes: "rim stiffness/damping" },
    { command: "PhysicsLab.backboard(22000, 130)", changes: "backboard stiffness/damping" },
    { command: "PhysicsLab.net(2)", changes: "net dampingCoefficient" },
  ]);

  console.log("Integrator:");
  console.table([
    { command: "PhysicsLab.timestep(1 / 240)", changes: "fixed timestep" },
    { command: "PhysicsLab.integrator('SemiImplicitEuler')", purpose: "Stable default integrator" },
    { command: "PhysicsLab.integrator('ExplicitEuler')", purpose: "Basic explicit Euler" },
    { command: "PhysicsLab.integrator('Verlet')", purpose: "Verlet integration" },
  ]);

  console.groupEnd();
}

export function exposePhysicsLab() {
  window.PhysicsLab = {
    run,
    help,
    resetOverrides,
    showOverrides,

    gravity(value) {
      return run({
        overrides: {
          environment: { g: value },
        },
      });
    },

    airDensity(value) {
      return run({
        overrides: {
          environment: {
            air: { rho: value },
          },
        },
      });
    },

    wind(x = 0, y = 0, z = 0) {
      return run({
        overrides: {
          environment: {
            air: {
              wind: { x, y, z },
            },
          },
        },
      });
    },

    drag(value) {
      return run({
        overrides: {
          ball: {
            aerodynamics: { Cd: value },
          },
        },
      });
    },

    magnus(value) {
      return run({
        overrides: {
          ball: {
            aerodynamics: { magnusCoefficient: value },
          },
        },
      });
    },

    lift(value) {
      return run({
        overrides: {
          ball: {
            aerodynamics: { Cl: value },
          },
        },
      });
    },

    angularDamping(value) {
      return run({
        overrides: {
          ball: {
            aerodynamics: { angularDampingCoefficient: value },
          },
        },
      });
    },

    enable(name) {
      return setEnabled(name, true);
    },

    disable(name) {
      return setEnabled(name, false);
    },

    force(name, enabled) {
      return setEnabled(name, enabled);
    },

    forces(flags) {
      return setManyEnabled(flags);
    },

    onlyGravity() {
      return run({
        overrides: {
          enabled: {
            gravity: true,
            drag: false,
            magnus: false,
            buoyancy: false,
            normalForce: false,
            staticFriction: false,
            kineticFriction: false,
            rollingResistance: false,
            angularDamping: false,
            netResistance: false,
            contact: false,
            restitution: false,
            penetrationCorrection: false,
            continuousCollisionDetection: false,
          },
        },
      });
    },

    noAir() {
      return run({
        overrides: {
          enabled: {
            drag: false,
            magnus: false,
            buoyancy: false,
          },
        },
      });
    },

    noSpinEffects() {
      return run({
        overrides: {
          enabled: {
            magnus: false,
            angularDamping: false,
          },
        },
      });
    },

    noFriction() {
      return run({
        overrides: {
          enabled: {
            staticFriction: false,
            kineticFriction: false,
            rollingResistance: false,
          },
        },
      });
    },

    noCollisions() {
      return run({
        overrides: {
          enabled: {
            contact: false,
            restitution: false,
            penetrationCorrection: false,
            continuousCollisionDetection: false,
          },
        },
      });
    },

    collisions(enabled = true) {
      return run({
        overrides: {
          enabled: {
            contact: enabled,
            restitution: enabled,
            penetrationCorrection: enabled,
          },
        },
      });
    },

    ccd(enabled = true) {
      return run({
        overrides: {
          enabled: {
            continuousCollisionDetection: enabled,
          },
        },
      });
    },

    restitution(target, value) {
      return run({
        overrides: {
          ball: {
            restitution: {
              [target]: value,
            },
          },
        },
      });
    },

    friction(muS, muK) {
      return run({
        overrides: {
          ball: {
            friction: { muS, muK },
          },
        },
      });
    },

    ground(stiffness, damping) {
      return run({
        overrides: {
          court: {
            ground: { stiffness, damping },
          },
        },
      });
    },

    rim(stiffness, damping) {
      return run({
        overrides: {
          court: {
            hoop: { stiffness, damping },
          },
        },
      });
    },

    backboard(stiffness, damping) {
      return run({
        overrides: {
          court: {
            backboard: { stiffness, damping },
          },
        },
      });
    },

    net(value) {
      return run({
        overrides: {
          court: {
            net: { dampingCoefficient: value },
          },
        },
      });
    },

    timestep(value) {
      return run({
        overrides: {
          integrator: {
            fixedTimestep: value,
          },
        },
      });
    },

    integrator(type) {
      return run({
        overrides: {
          integrator: { type },
        },
      });
    },

    custom(overrides, steps = 120) {
      return run({ overrides, steps });
    },
  };

  console.log("PhysicsLab ready. Type PhysicsLab.help() to see commands.");
}