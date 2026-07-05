import { BasketballGeometry } from "./BasketballGeometry.js";
import { BasketballInertia } from "./BasketballInertia.js";

export const BasketballDerivedValues = Object.freeze({
  geometry: BasketballGeometry,
  inertia: BasketballInertia,

  snapshot() {
    return {
      R: Number(BasketballGeometry.R.toFixed(4)),
      D: Number(BasketballGeometry.D.toFixed(4)),
      A: Number(BasketballGeometry.A.toFixed(4)),
      V: Number(BasketballGeometry.V.toFixed(4)),
      I: Number(BasketballInertia.I.toFixed(4)),
    };
  },
});