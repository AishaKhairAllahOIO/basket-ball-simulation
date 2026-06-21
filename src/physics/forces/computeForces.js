import { gravityForce } from "./gravityForce.js";
import { dragForce } from "./dragForce.js";
import { magnusForce } from "./magnusForce.js";
import { buoyancyForce } from "./buoyancyForce.js";
import { physicsConfig } from "../config/physicsConfig.js";

export function computeForces(body) {
  body.clearForces();

  if (physicsConfig.enabled.gravity) {
    body.addForce(gravityForce(body));
  }

  if (physicsConfig.enabled.drag) {
    body.addForce(dragForce(body));
  }

  if (physicsConfig.enabled.magnus) {
    body.addForce(magnusForce(body));
  }

  if (physicsConfig.enabled.buoyancy) {
    body.addForce(buoyancyForce(body));
  }

  if (physicsConfig.enabled.angularDamping) {
    body.addTorque(
      body.angularVelocity
        .clone()
        .multiplyScalar(-physicsConfig.aerodynamics.angularDamping)
    );
  }
}