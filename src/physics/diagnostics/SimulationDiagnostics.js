import { EnergyDiagnostics } from "./EnergyDiagnostics.js";
import { ForceDiagnostics } from "./ForceDiagnostics.js";
import { MomentumDiagnostics } from "./MomentumDiagnostics.js";
import { RollingStateDetector } from "../rules/RollingStateDetector.js";

export function SimulationDiagnostics(body, config, world = null) 
{
  const contacts = world?.lastContacts ?? [];
  return {
    position: 
    {
      x: body.position.x,
      y: body.position.y,
      z: body.position.z,
    },

    velocity: 
    {
      x: body.v.x,
      y: body.v.y,
      z: body.v.z,
      magnitude: body.v.length(),
    },

    rollingState: RollingStateDetector(body, contacts),

    angularVelocity: 
    {
      x: body.omega.x,
      y: body.omega.y,
      z: body.omega.z,
      magnitude: body.omega.length(),
    },

    energy: EnergyDiagnostics(body, config),
    energyAnalysis: world?.lastEnergyAnalysis ?? null,


    momentum: MomentumDiagnostics(body),

    forces: ForceDiagnostics(body),

    contacts: 
    {
      ground: body.touchedGround,
      rim: body.touchedRim,
      backboard: body.touchedBackboard,
    },

    score: body.hasScored,
  };
}