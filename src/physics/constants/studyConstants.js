export const studyConstants = {
  g: 9.81,

  air: {
    rho: 1.2,
    Cd: 0.5,
  },

  ball: {
    m: 0.6,
    R: 0.121,
    C: 0.76,
    D: 0.242,
    A: 0.046,
    V: 0.0074,
    lambda: 0.67,
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
    x: 3.05,
    y: 3.05,
    z: 0,
    normalDirection: -1,
  },

  net: {
    height: 0.425,
    attachmentPoints: 12,
  },

  integrator: {
    dt: 1 / 120,
  },
};