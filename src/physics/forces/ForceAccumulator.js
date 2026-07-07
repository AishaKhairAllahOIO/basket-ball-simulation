import { Gravity } from "./Gravity.js";
import { AerodynamicDrag } from "./AerodynamicDrag.js";
import { MagnusEffect } from "./MagnusEffect.js";
import { Buoyancy } from "./Buoyancy.js";
import { NormalForce } from "./NormalForce.js";
import { StaticFriction } from "./StaticFriction.js";
import { KineticFriction } from "./KineticFriction.js";
import { NetResistance } from "./NetResistance.js";
import { AngularDamping } from "./AngularDamping.js";

export function ForceAccumulator(body, contacts, config, dt) {
  body.addForce(Gravity(body, config));

  body.addForce(AerodynamicDrag(body, config));

  body.addForce(MagnusEffect(body, config));

  body.addForce(Buoyancy(body, config));

  for (const contact of contacts) {
    const Fn = NormalForce(body, contact);

    body.addForce(Fn);

    const normalForceMagnitude = Fn.length();

    let staticFriction = {
      canApplyStatic: false,
    };

    if (config.enabled.staticFriction) {
      staticFriction = StaticFriction(
        body,
        contact,
        normalForceMagnitude,
        dt
      );

      body.addForce(staticFriction.Ff);
      body.addTorque(staticFriction.tau);
    }

    if (
      !staticFriction.canApplyStatic &&
      config.enabled.kineticFriction
    ) {
      const kineticFriction = KineticFriction(
        body,
        contact,
        normalForceMagnitude
      );

      body.addForce(kineticFriction.Ff);
      body.addTorque(kineticFriction.tau);
    }
  }

  if (config.netState?.isInsideNet) {
    body.addForce(NetResistance(body, config));
  }

  body.addTorque(AngularDamping(body, config));
}