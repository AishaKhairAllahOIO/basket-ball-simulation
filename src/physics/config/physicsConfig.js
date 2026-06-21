export const physicsConfig = {
  enabled: {
    gravity: true,
    drag: true,
    magnus: true,
    buoyancy: true,
    groundCollision: true,
    backboardCollision: true,
    rimCollision: true,
    netForce: true,
    penetrationCorrection: true,
    angularDamping: true,
  },

  launch: {
    angleDeg: 44,
    speed: 8.6,
    sideOffset: 0,
    backspin: 6,
    topspin: 0,
    sidespin: 0,
  },

  ball: {
    mass: 0.6,
    radius: 0.121,
    inertiaFactor: 0.67,
    internalPressureEffect: 1,
    surfaceRoughness: 1,
  },

  environment: {
    gravity: 9.81,
    airDensity: 1.2,
    windX: 0,
    windY: 0,
    windZ: 0,
  },

  aerodynamics: {
    dragCoefficient: 0.5,
    magnusCoefficient: 0.002,
    angularDamping: 0.002,
  },

  restitution: {
    ground: 0.8,
    backboard: 0.65,
    rim: 0.6,
    pole: 0.35,
  },

  friction: {
    static: 0.65,
    kinetic: 0.45,
    rim: 0.35,
    backboard: 0.25,
  },

  contact: {
    stiffness: 14000,
    damping: 90,
    penetrationCorrectionFactor: 0.8,
  },

  hoop: {
    rimRadius: 0.225,
    rimTubeRadius: 0.009,
    height: 3.05,
    x: 2.9,
    z: 0,
  },

  backboard: {
    width: 1.8,
    height: 1.05,
    depth: 0.05,
    x: 3.05,
    y: 3.05,
    z: 0,
  },

  net: {
    height: 0.425,
    damping: 0.992,
    lateralDamping: 0.996,
    attachmentPoints: 12,
  },

  integrator: {
    fixedTimestep: 1 / 120,
    maxSubSteps: 8,
    maxVelocity: 35,
  },
};