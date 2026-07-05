import { EnergyDiagnostics } from "./EnergyDiagnostics.js";
import { ForceDiagnostics } from "./ForceDiagnostics.js";

export function SimulationDiagnostics(body) {
  return {
    position: {
      x: body.position.x,
      y: body.position.y,
      z: body.position.z,
    },

    velocity: {
      x: body.v.x,
      y: body.v.y,
      z: body.v.z,
      magnitude: body.v.length(),
    },

    angularVelocity: {
      x: body.omega.x,
      y: body.omega.y,
      z: body.omega.z,
      magnitude: body.omega.length(),
    },

    energy: EnergyDiagnostics(body),

    forces: ForceDiagnostics(body),

    contacts: {
      ground: body.touchedGround,
      rim: body.touchedRim,
      backboard: body.touchedBackboard,
    },

    score: body.hasScored,
  };
}