import { Energy } from "../dynamics/Energy.js";

export function EnergyAnalysis(previousEnergy, body, config) {
  const current = Energy(body, config);

  if (!previousEnergy) {
    return {
      current,
      previous: null,
      delta: 0,
      lost: 0,
      gained: 0,
      conservationRatio: 1,
      note: "initial-energy-snapshot",
    };
  }

  const delta = current.E - previousEnergy.E;

  return {
    current,
    previous: previousEnergy,

    delta,

    lost: delta < 0 ? Math.abs(delta) : 0,
    gained: delta > 0 ? delta : 0,

    conservationRatio:
      previousEnergy.E !== 0 ? current.E / previousEnergy.E : 1,

    note:
      delta < 0
        ? "energy-loss"
        : delta > 0
        ? "energy-gain"
        : "energy-conserved",
  };
}