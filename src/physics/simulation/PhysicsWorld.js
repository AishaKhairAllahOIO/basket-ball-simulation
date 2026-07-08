import { createPhysicsConfig } from "../config/createPhysicsConfig.js";

import { ContactManager } from "../contact/ContactManager.js";
import { PenetrationCorrection } from "../contact/PenetrationCorrection.js";

import { ForceAccumulator } from "../forces/ForceAccumulator.js";

import { applyLinearMotion } from "../motion/LinearMotion.js";
import { applyAngularMotion } from "../motion/AngularMotion.js";

import { ImpulseSolver } from "../response/ImpulseSolver.js";

import { IntegratorFactory } from "../integrators/IntegratorFactory.js";

import { ScoreDetector } from "../rules/ScoreDetector.js";
import { ContinuousCollisionDetection } from "../contact/ContinuousCollisionDetection.js";
import { Energy } from "../dynamics/Energy.js";
import { EnergyAnalysis } from "../diagnostics/EnergyAnalysis.js";

export class PhysicsWorld 
{
  constructor(body, configOverrides = {}) 
  {
    this.body = body;
    this.config = createPhysicsConfig(configOverrides);

    this.accumulator = 0;
    this.integrator = IntegratorFactory(this.config.integrator.type);
    this.previousEnergy = Energy(this.body, this.config);
    this.lastEnergyAnalysis = null;
  }

  step(frameDt) 
  {
    const dt = this.config.integrator.fixedTimestep;
    const maxSubSteps = this.config.integrator.maxSubSteps;

    this.accumulator += frameDt;

    let result = null;
    let steps = 0;

    while (this.accumulator >= dt && steps < maxSubSteps)
    {
      this.body.clearForces();

      const contacts = ContactManager(this.body, this.config);
      this.lastContacts = contacts;

      const netState = this.computeNetState();

     
      ForceAccumulator
      (
        this.body,
        contacts,
        {
          ...this.config,
          netState,
        },
        dt
      );
      applyLinearMotion(this.body);
      applyAngularMotion(this.body);

      ImpulseSolver(this.body, contacts, this.config);

      this.integrator.step(this.body, dt);

      const ccdContacts = ContinuousCollisionDetection(this.body, this.config);

      if (ccdContacts.length > 0) 
      {
        ImpulseSolver(this.body, ccdContacts, this.config);
        PenetrationCorrection(this.body, ccdContacts, this.config);
      }

      PenetrationCorrection(this.body, contacts, this.config);

      result = ScoreDetector(this.body, this.config);
      this.lastEnergyAnalysis = EnergyAnalysis
      (
        this.previousEnergy,
        this.body,
        this.config
      );

      this.previousEnergy = this.lastEnergyAnalysis.current;

      this.accumulator -= dt;
      steps += 1;
    }

    return result;
  }

  computeNetState() 
  {
    const rim = this.config.court.hoop;
    const net = this.config.court.net;

    const rimRadius = rim.rimInnerDiameter / 2;

    const dx = this.body.position.x - rim.x;
    const dz = this.body.position.z - rim.z;

    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

    return {
      isInsideNet:
        horizontalDistance < rimRadius &&
        this.body.position.y < rim.y &&
        this.body.position.y > rim.y - net.height,
    };
  }
}