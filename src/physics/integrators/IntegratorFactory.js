import { ExplicitEuler } from "./ExplicitEuler.js";
import { SemiImplicitEuler } from "./SemiImplicitEuler.js";
import { Verlet } from "./Verlet.js";
import { RungeKutta2 } from "./RungeKutta2.js";
import { RungeKutta4 } from "./RungeKutta4.js";

export const IntegratorType = Object.freeze({
  ExplicitEuler: "ExplicitEuler",
  SemiImplicitEuler: "SemiImplicitEuler",
  Verlet: "Verlet",
  RungeKutta2: "RungeKutta2",
  RungeKutta4: "RungeKutta4",
});

export function IntegratorFactory(type = IntegratorType.SemiImplicitEuler) {
  switch (type) {
    case IntegratorType.ExplicitEuler:
      return new ExplicitEuler();

    case IntegratorType.Verlet:
      return new Verlet();

    case IntegratorType.RungeKutta2:
      return new RungeKutta2();

    case IntegratorType.RungeKutta4:
      return new RungeKutta4();

    case IntegratorType.SemiImplicitEuler:
    default:
      return new SemiImplicitEuler();
  }
}