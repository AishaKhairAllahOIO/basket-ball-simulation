export const CourtProperties = Object.freeze({
  ground: {
    y: 0,
    stiffness: 14000,
    damping: 90,
  },

  hoop: {
    x: 2.9,
    y: 3.05,
    z: 0,

    rimInnerDiameter: 0.45,
    rimMetalDiameter: 0.018,

    stiffness: 18000,
    damping: 110,
  },

  backboard: {
    width: 1.8,
    height: 1.05,
    depth: 0.05,

    x: 3.05,
    y: 3.05,
    z: 0,

    rimOffsetFromBoard: 0.151,
    normalDirection: -1,

    stiffness: 16000,
    damping: 100,
  },

  net: {
    height: 0.425,
    attachmentPoints: 12,
    dampingCoefficient: 1.2,
  },
});