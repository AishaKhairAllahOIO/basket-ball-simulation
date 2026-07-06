import { Gravity } from "./Gravity.js";
import { AerodynamicDrag } from "./AerodynamicDrag.js";
import { MagnusEffect } from "./MagnusEffect.js";
import { Buoyancy } from "./Buoyancy.js";
import { NormalForce } from "./NormalForce.js";
import { KineticFriction } from "./KineticFriction.js";
import { NetResistance } from "./NetResistance.js";
import { AngularDamping } from "./AngularDamping.js";

export function ForceAccumulator(body, contacts, config) {
  body.addForce(Gravity(body, config));
  body.addForce(AerodynamicDrag(body, config));
  body.addForce(MagnusEffect(body, config));
  body.addForce(Buoyancy(body, config));

  for (const contact of contacts) {
    const Fn = NormalForce(body, contact);

    body.addForce(Fn);

    const friction = KineticFriction(body, contact, Fn.length());

    body.addForce(friction.Ff);
    body.addTorque(friction.tau);
  }

  if (config.netState?.isInsideNet) {
    body.addForce(NetResistance(body, config));
  }

  body.addTorque(AngularDamping(body, config));
}