import { BasketballProperties } from "../properties/BasketballProperties.js";
import { BasketballGeometry } from "./BasketballGeometry.js";

export const BasketballInertia = Object.freeze({
  get I() 
  {
    return (
      BasketballProperties.lambda *
      BasketballProperties.m *
      BasketballGeometry.R ** 2
    );
  },
});