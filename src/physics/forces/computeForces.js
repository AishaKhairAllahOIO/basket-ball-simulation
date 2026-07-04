import { physicsConfig } from "../config/physicsConfig.js";
import {
  computeCrossSectionArea,
  computeSphereVolume,
} from "../math/physicsMath.js";

import { gravityForce } from "./gravityForce.js";
import { dragForce } from "./dragForce.js";
import { magnusForce } from "./magnusForce.js";
import { buoyancyForce } from "./buoyancyForce.js";
import { normalForce } from "./normalForce.js";
import { frictionForce } from "./frictionForce.js";
import { netForce } from "./netForce.js";
import { angularDampingTorque } from "./angularDampingTorque.js";

export function computeForces(body, contacts = [], netState = null) {
  body.clearForces();

  const config = physicsConfig;

  if (config.enabled.gravity) {
    body.addForce(
      gravityForce(body, config.environment.gravity)
    );
  }

  if (config.enabled.drag) {
    body.addForce(
      dragForce({
        body,
        rho: config.environment.airDensity,
        Cd: config.aerodynamics.dragCoefficient,
        A: computeCrossSectionArea(body.radius),
        wind: config.environment.wind,
      })
    );
  }

  if (config.enabled.magnus) {
    body.addForce(
      magnusForce({
        body,
        magnusCoefficient: config.aerodynamics.magnusCoefficient,
      })
    );
  }

  if (config.enabled.buoyancy) {
    body.addForce(
      buoyancyForce({
        rho: config.environment.airDensity,
        V: computeSphereVolume(body.radius),
        g: config.environment.gravity,
      })
    );
  }

  for (const contact of contacts) {
    const n = contact.normal.clone().normalize();
    const vn = body.velocity.dot(n);

    const Fn = normalForce({
      normal: n,
      penetrationDepth: contact.penetrationDepth,
      normalVelocity: vn,
      stiffness: contact.stiffness,
      damping: contact.damping,
    });

    body.addForce(Fn);

    const friction = frictionForce({
      body,
      contactPoint: contact.contactPoint,
      normal: n,
      normalForceMagnitude: Fn.length(),
      muS: contact.staticFriction,
      muK: contact.kineticFriction,
    });

    body.addForce(friction.Ff);
    body.addTorque(friction.tau);
  }

  if (config.enabled.netForce && netState?.isInsideNet) {
    body.addForce(
      netForce({
        body,
        dampingCoefficient: config.net.dampingCoefficient,
      })
    );
  }

  if (config.enabled.angularDamping) {
    body.addTorque(
      angularDampingTorque({
        body,
        coefficient: config.aerodynamics.angularDampingCoefficient,
      })
    );
  }

  body.acceleration.copy(body.force).divideScalar(body.mass);
  body.angularAcceleration.copy(body.torque).divideScalar(body.inertia);

  return {
    force: body.force.clone(),
    torque: body.torque.clone(),
    acceleration: body.acceleration.clone(),
    angularAcceleration: body.angularAcceleration.clone(),
  };
}