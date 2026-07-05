export const BasketballProperties = Object.freeze({
  m: 0.6,
  C: 0.76,
  lambda: 0.67,

  pressureEffect: 1,
  surfaceRoughness: 1,

  aerodynamics: {
    Cd: 0.5,
    Cl: 0.18,
    magnusCoefficient: 0.002,
    angularDampingCoefficient: 0.002,
  },

  restitution: {
    ground: 0.8,
    backboard: 0.65,
    rim: 0.6,
  },

  friction: {
    muS: 0.65,
    muK: 0.45,
  },
});