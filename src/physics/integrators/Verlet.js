export class Verlet {
  step(body, dt) {
    const currentPosition = body.position.clone();

    const nextPosition = body.position
      .clone()
      .multiplyScalar(2)
      .sub(body.previousPosition)
      .add(body.a.clone().multiplyScalar(dt * dt));

    body.v.copy(
      nextPosition.clone().sub(body.previousPosition).divideScalar(2 * dt)
    );

    body.previousPosition.copy(currentPosition);
    body.position.copy(nextPosition);

    body.omega.add(
      body.alpha.clone().multiplyScalar(dt)
    );
  }
}