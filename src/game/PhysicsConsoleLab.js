import { Basketball } from "../physics/bodies/Basketball.js";
import { PhysicsWorld } from "../physics/simulation/PhysicsWorld.js";
import { SimulationDiagnostics } from "../physics/diagnostics/SimulationDiagnostics.js";

let currentOverrides = {};

function run({ overrides = {}, steps = 120, dt = 1 / 120 } = {}) {
  const ball = new Basketball();

  currentOverrides = {
    ...currentOverrides,
    ...overrides,
  };

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
    });
  }

  console.table(rows);

  return {
    ball,
    world,
    rows,
    diagnostics: SimulationDiagnostics(ball, world.config, world),
  };
}

function resetOverrides() {
  currentOverrides = {};
  console.log("PhysicsLab overrides cleared.");
}

export function exposePhysicsLab() {
  window.PhysicsLab = {
    run,
    resetOverrides,

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

    buoyancy(enabled) {
      return run({
        overrides: {
          enabled: { buoyancy: enabled },
        },
      });
    },

    force(name, enabled) {
      return run({
        overrides: {
          enabled: {
            [name]: enabled,
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

  console.log("PhysicsLab ready.");
}