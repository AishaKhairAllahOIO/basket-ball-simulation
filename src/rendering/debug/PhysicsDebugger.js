export class PhysicsDebugger {
  constructor() {
    this.enabled = true;
  }

  printBall(ball) {
    if (!this.enabled) return;

    console.clear();

    console.table({
      x: ball.position.x.toFixed(2),
      y: ball.position.y.toFixed(2),
      z: ball.position.z.toFixed(2),

      vx: ball.velocity.x.toFixed(2),
      vy: ball.velocity.y.toFixed(2),
      vz: ball.velocity.z.toFixed(2),

      spin:
        ball.angularVelocity.length()
          .toFixed(2),
    });
  }
}