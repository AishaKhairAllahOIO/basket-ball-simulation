import { Energy } from "../dynamics/Energy.js";

export function EnergyDiagnostics(body, config) 
{
  const energy = Energy(body, config);

  return {
    translational: energy.Kt,
    rotational: energy.Kr,
    potential: energy.U,
    total: energy.E,
  };
}