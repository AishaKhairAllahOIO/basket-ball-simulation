export class FixedTimestep {
  constructor({ timestep = 1 / 120, maxSubSteps = 8 }) {
    this.timestep = timestep;
    this.maxSubSteps = maxSubSteps;
    this.accumulator = 0;
  }

  update(deltaTime, callback) {
    this.accumulator += Math.min(deltaTime, 0.1);

    let steps = 0;

    while (this.accumulator >= this.timestep && steps < this.maxSubSteps) {
      callback(this.timestep);
      this.accumulator -= this.timestep;
      steps++;
    }
  }
}