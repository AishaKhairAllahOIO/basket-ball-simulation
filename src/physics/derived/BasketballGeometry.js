import { BasketballProperties } from "../properties/BasketballProperties.js";

export const BasketballGeometry = Object.freeze({
  get R() 
  {
    return BasketballProperties.C / (2 * Math.PI);
  },

  get D() 
  {
    return 2 * this.R;
  },

  get A() 
  {
    return Math.PI * this.R ** 2;
  },

  get V() 
  {
    return (4 / 3) * Math.PI * this.R ** 3;
  },
});