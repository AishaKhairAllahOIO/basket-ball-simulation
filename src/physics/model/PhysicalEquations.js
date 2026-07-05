export const PhysicalEquations = Object.freeze({

  gravity: {
    symbol: "Fg",
    equation: "Fg = m g",
    implementation: "forces/Gravity.js",
  },

  drag: {
    symbol: "Fd",
    equation: "Fd = -0.5 ρ Cd A |v|²",
    implementation: "forces/AerodynamicDrag.js",
  },

  magnus: {
    symbol: "FM",
    equation: "FM = S (ω × v)",
    implementation: "forces/MagnusEffect.js",
  },

  buoyancy: {
    symbol: "Fb",
    equation: "Fb = ρ V g",
    implementation: "forces/Buoyancy.js",
  },

  normalForce: {
    symbol: "Fn",
    equation: "Fn = kδ − cv",
    implementation: "forces/NormalForce.js",
  },

  staticFriction: {
    symbol: "Fs",
    equation: "|Fs| ≤ μsFn",
    implementation: "forces/StaticFriction.js",
  },

  kineticFriction: {
    symbol: "Fk",
    equation: "Fk = μkFn",
    implementation: "forces/KineticFriction.js",
  },

  torque: {
    symbol: "τ",
    equation: "τ = r × F",
    implementation: "forces/KineticFriction.js",
  },

  impulse: {
    symbol: "J",
    equation: "J = ∫F dt",
    implementation: "response/ImpulseSolver.js",
  },

  restitution: {
    symbol: "e",
    equation: "e = relative speed after / relative speed before",
    implementation: "response/Restitution.js",
  },

  linearMotion: {
    equation: "ΣF = ma",
    implementation: "motion/LinearMotion.js",
  },

  angularMotion: {
    equation: "Στ = Iα",
    implementation: "motion/AngularMotion.js",
  },

  translationalEnergy: {
    equation: "Kt = 1/2 mv²",
    implementation: "dynamics/Energy.js",
  },

  rotationalEnergy: {
    equation: "Kr = 1/2 Iω²",
    implementation: "dynamics/Energy.js",
  },

  potentialEnergy: {
    equation: "U = mgh",
    implementation: "dynamics/Energy.js",
  },

});