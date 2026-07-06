import { PhysicsConfig } from "./PhysicsConfig.js";

import { BasketballProperties } from "../properties/BasketballProperties.js";
import { CourtProperties } from "../properties/CourtProperties.js";
import { EnvironmentProperties } from "../properties/EnvironmentProperties.js";

import { BasketballGeometry } from "../derived/BasketballGeometry.js";
import { BasketballInertia } from "../derived/BasketballInertia.js";

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

export function createPhysicsConfig(overrides = {}) {
  const baseConfig = {
    enabled: PhysicsConfig.enabled,
    integrator: PhysicsConfig.integrator,
    limits: PhysicsConfig.limits,

    ball: {
      ...BasketballProperties,
      geometry: BasketballGeometry,
      inertia: BasketballInertia,
    },

    court: CourtProperties,
    environment: EnvironmentProperties,
  };

  return deepMerge(baseConfig, overrides);
}