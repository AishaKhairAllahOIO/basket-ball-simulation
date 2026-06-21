import { Basketball } from "../bodies/Basketball.js";
import { computeForces } from "../forces/computeForces.js";
import { semiImplicitEuler } from "../integrators/semiImplicitEuler.js";
import { handleGroundCollision } from "../collisions/courtCollisions.js";
import { handleBackboardCollision } from "../collisions/backboardCollisions.js";
import { handleRimCollision } from "../collisions/rimCollisions.js";
import { detectScore } from "../scoring/scoreDetector.js";

export class Simulation {
  constructor() {
    this.ball = new Basketball();
    this.score = 0;
  }

  reset() {
    this.ball.reset();
  }

  step(dt) {
    computeForces(this.ball);
    semiImplicitEuler(this.ball, dt);

    handleGroundCollision(this.ball);
    handleBackboardCollision(this.ball);
    handleRimCollision(this.ball);

    if (detectScore(this.ball)) {
      this.score += 1;
      console.log("SCORE!");
    }
  }
}