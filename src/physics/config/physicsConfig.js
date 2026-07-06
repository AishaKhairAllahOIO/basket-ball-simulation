export const PhysicsConfig = Object.freeze({

  enabled: {

    gravity: true,

    drag: true,

    magnus: true,

    buoyancy: true,

    normalForce: true,

    staticFriction: true,

    kineticFriction: true,

    rollingResistance: true,

    angularDamping: true,

    netResistance: true,

    contact: true,

    restitution: true,

    penetrationCorrection: true,

    continuousCollisionDetection: true,

    diagnostics: false,

  },

  integrator: {

    type: "SemiImplicitEuler",

    fixedTimestep: 1 / 120,

    maxSubSteps: 8,

  },

  limits: {

    maxVelocity: 35,

    maxAngularVelocity: 120,

  },

});