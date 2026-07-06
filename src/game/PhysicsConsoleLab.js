import { Basketball } from "../physics/bodies/Basketball.js";
import { PhysicsWorld } from "../physics/simulation/PhysicsWorld.js";

function run({ overrides = {}, steps = 120, dt = 1 / 120 } = {}) {
  const ball = new Basketball();
  const world = new PhysicsWorld(ball, overrides);

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
    });
  }

  console.table(rows);
  return { ball, world, rows };
}

export function exposePhysicsLab() {
  window.PhysicsLab = {
    run,

    gravity(value) {
      return run({
        overrides: {
          environment: {
            g: value,
          },
        },
      });
    },

    drag(value) {
      return run({
        overrides: {
          ball: {
            aerodynamics: {
              Cd: value,
            },
          },
        },
      });
    },

    magnus(value) {
      return run({
        overrides: {
          ball: {
            aerodynamics: {
              magnusCoefficient: value,
            },
          },
        },
      });
    },

    buoyancy(enabled) {
      return run({
        overrides: {
          enabled: {
            buoyancy: enabled,
          },
        },
      });
    },

    noCollisions() {
      return run({
        overrides: {
          enabled: {
            contact: false,
            penetrationCorrection: false,
            restitution: false,
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

    friction(muK) {
      return run({
        overrides: {
          ball: {
            friction: {
              muK,
            },
          },
        },
      });
    },
  };

  console.log("PhysicsLab ready.");
  console.log("Examples:");
  console.log("PhysicsLab.noCollisions()");
  console.log("PhysicsLab.gravity(15)");
  console.log("PhysicsLab.drag(0)");
  console.log("PhysicsLab.magnus(0.01)");
  console.log("PhysicsLab.restitution('rim', 0.9)");
}