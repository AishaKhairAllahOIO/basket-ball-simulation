import { CourtGeometry } from "./CourtGeometry.js";

const halfLength = CourtGeometry.length / 2;

const basketX = halfLength - CourtGeometry.basketCenterFromEndLine; 
const backboardFaceX = halfLength - CourtGeometry.backboardFaceFromEndLine; 

const backboardWidth = 1.8; 
const backboardHeight = 1.05; 
const backboardLowerEdge = 2.9;

export const CourtProperties = Object.freeze({
  ground: {
    y: 0,
    stiffness: 14000,
    damping: 90,
  },

  hoop: {
    x: basketX,
    y: 3.05,
    z: 0,

    rimInnerDiameter: 0.45, 
    rimMetalDiameter: 0.018, 

    stiffness: 18000,
    damping: 110,
  },

  backboard: {
    width: backboardWidth,
    height: backboardHeight,
    depth: 0.05,

    x: backboardFaceX, 
    y: backboardLowerEdge + backboardHeight / 2, 
    z: 0,

    rimOffsetFromBoard: 0.375, 
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