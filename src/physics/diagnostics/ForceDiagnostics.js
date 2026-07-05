export function ForceDiagnostics(body) {
  return {
    force: {
      x: body.F.x,
      y: body.F.y,
      z: body.F.z,
    },

    torque: {
      x: body.tau.x,
      y: body.tau.y,
      z: body.tau.z,
    },

    acceleration: {
      x: body.a.x,
      y: body.a.y,
      z: body.a.z,
    },

    angularAcceleration: {
      x: body.alpha.x,
      y: body.alpha.y,
      z: body.alpha.z,
    },
  };
}