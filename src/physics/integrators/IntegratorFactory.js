import { ExplicitEuler } from "./ExplicitEuler.js";
import { SemiImplicitEuler } from "./SemiImplicitEuler.js";
import { Verlet } from "./Verlet.js";

export const IntegratorType = Object.freeze({
  ExplicitEuler: "ExplicitEuler",
  SemiImplicitEuler: "SemiImplicitEuler",
  Verlet: "Verlet",
});

export function IntegratorFactory(type = IntegratorType.SemiImplicitEuler) {
  switch (type) {
    case IntegratorType.ExplicitEuler:
      return new ExplicitEuler();

    case IntegratorType.Verlet:
      return new Verlet();


    case IntegratorType.SemiImplicitEuler:
    default:
      return new SemiImplicitEuler();
  }
}