import { gravityForce } from "./gravityForce.js";
import { dragForce } from "./dragForce.js";
import { magnusForce } from "./magnusForce.js";
import { buoyancyForce } from "./buoyancyForce.js";

export function computeForces(body) {
  body.clearForces();

  body.addForce(gravityForce(body));
  body.addForce(dragForce(body));
  body.addForce(magnusForce(body));
  body.addForce(buoyancyForce(body));

  body.addTorque(body.angularVelocity.clone().multiplyScalar(-0.002));
}