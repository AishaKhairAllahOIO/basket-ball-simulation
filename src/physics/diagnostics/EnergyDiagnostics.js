import { Energy } from "../dynamics/Energy.js";

export function EnergyDiagnostics(body) {
  const energy = Energy(body);

  return {
    translational: energy.Kt,
    rotational: energy.Kr,
    potential: energy.U,
    total: energy.E,
  };
}