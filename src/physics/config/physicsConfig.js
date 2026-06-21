export const physicsConfig = {
  gravity: 9.81,
  airDensity: 1.2,
  dragCoefficient: 0.5,
  magnusCoefficient: 0.00035,

  restitution: {
    ground: 0.78,
    backboard: 0.62,
    rim: 0.55,
  },

  friction: {
    kinetic: 0.45,
    static: 0.65,
  },

  angularDamping: 0.995,
  linearSleepThreshold: 0.03,
};