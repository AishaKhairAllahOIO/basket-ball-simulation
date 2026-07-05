export class FixedTimestep {
  constructor({ timestep = 1 / 60, maxSubSteps = 8 }) {
    this.timestep = timestep;
    this.maxSubSteps = maxSubSteps;

    this.accumulator = 0;
  }

  update(frameDt, callback) {
    this.accumulator += frameDt;

    let steps = 0;

    while (this.accumulator >= this.timestep && steps < this.maxSubSteps) {
      callback(this.timestep);

      this.accumulator -= this.timestep;
      steps++;
    }
  }
}