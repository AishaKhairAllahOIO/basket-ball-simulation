import { PhysicsConfig } from "./PhysicsConfig.js";

import { BasketballProperties } from "../properties/BasketballProperties.js";
import { CourtProperties } from "../properties/CourtProperties.js";
import { EnvironmentProperties } from "../properties/EnvironmentProperties.js";

import { BasketballGeometry } from "../derived/BasketballGeometry.js";
import { BasketballInertia } from "../derived/BasketballInertia.js";

export function createPhysicsConfig(overrides = {}) {

  return {

    enabled: {

      ...PhysicsConfig.enabled,

      ...(overrides.enabled ?? {}),

    },

    integrator: {

      ...PhysicsConfig.integrator,

      ...(overrides.integrator ?? {}),

    },

    limits: {

      ...PhysicsConfig.limits,

      ...(overrides.limits ?? {}),

    },

    ball: {

      ...BasketballProperties,

      geometry: BasketballGeometry,

      inertia: BasketballInertia,

      ...(overrides.ball ?? {}),

    },

    court: {

      ...CourtProperties,

      ...(overrides.court ?? {}),

    },

    environment: {

      ...EnvironmentProperties,

      ...(overrides.environment ?? {}),

    },

  };

}