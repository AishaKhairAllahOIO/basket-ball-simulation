import { physicsConfig } from "../config/physicsConfig.js";

import { detectCollisions } from "../collisions/detectCollisions.js";
import { correctPenetration } from "../collisions/penetrationCorrection.js";

import { computeForces } from "../forces/computeForces.js";
import { semiImplicitEuler } from "../integrators/semiImplicitEuler.js";

import { updateScoringState } from "../scoring/scoringDetector.js";

export class PhysicsWorld {
  constructor(body) {
    this.body = body;
    this.accumulator = 0;
  }

  step(frameDt) {
    const dt = physicsConfig.integrator.fixedTimestep;
    const maxSubSteps = physicsConfig.integrator.maxSubSteps;

    this.accumulator += frameDt;

    let steps = 0;
    let scoringState = null;

    while (this.accumulator >= dt && steps < maxSubSteps) {
      const contacts = detectCollisions(this.body);

      computeForces(
        this.body,
        contacts,
        this.computeNetState()
      );

      semiImplicitEuler(this.body, dt);

      correctPenetration(this.body, contacts);

      scoringState = updateScoringState(this.body);

      this.accumulator -= dt;
      steps += 1;
    }

    return scoringState;
  }

  computeNetState() {
    const rim = physicsConfig.hoop;
    const net = physicsConfig.net;

    const dx = this.body.position.x - rim.x;
    const dz = this.body.position.z - rim.z;

    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

    const insideNetHorizontally =
      horizontalDistance < rim.rimRadius;

    const belowRim =
      this.body.position.y < rim.height;

    const aboveNetBottom =
      this.body.position.y > rim.height - net.height;

    return {
      isInsideNet:
        insideNetHorizontally && belowRim && aboveNetBottom,
    };
  }
}