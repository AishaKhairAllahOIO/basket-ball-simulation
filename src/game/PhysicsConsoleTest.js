import { Basketball } from "../physics/bodies/Basketball.js";
import { PhysicsWorld } from "../physics/simulation/PhysicsWorld.js";

export function runPhysicsTest() {
  const ball = new Basketball();
  const world = new PhysicsWorld(ball);

  console.log("=== START PHYSICS TEST ===");

  for (let i = 0; i < 120; i++) {
    const dt = 1 / 120;

    const result = world.step(dt);

    console.log(
      `t=${(i * dt).toFixed(3)} | `,
      `pos=(${ball.position.x.toFixed(2)}, ${ball.position.y.toFixed(2)}, ${ball.position.z.toFixed(2)}) | `,
      `vel=(${ball.v.x.toFixed(2)}, ${ball.v.y.toFixed(2)}, ${ball.v.z.toFixed(2)})`
    );

    if (result?.hasScored) {
      console.log("=== SCORE DETECTED ===");
      break;
    }
  }

  console.log("=== END TEST ===");
}