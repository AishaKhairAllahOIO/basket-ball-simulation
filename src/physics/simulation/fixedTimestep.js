export class FixedTimestep {
  constructor({ dt = 1 / 120, maxFrameTime = 0.05 }) {
    this.dt = dt;
    this.maxFrameTime = maxFrameTime;
    this.accumulator = 0;
    this.lastTime = performance.now();
  }

  step(now, update) {
    const frameTime = Math.min(
      (now - this.lastTime) / 1000,
      this.maxFrameTime
    );

    this.lastTime = now;
    this.accumulator += frameTime;

    while (this.accumulator >= this.dt) {
      update(this.dt);
      this.accumulator -= this.dt;
    }
  }
}