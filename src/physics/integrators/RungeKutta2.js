export class RungeKutta2 {
  step(body, dt) {
    body.previousPosition.copy(body.position);

    const vMid = body.v
      .clone()
      .add(body.a.clone().multiplyScalar(dt * 0.5));

    body.position.add(
      vMid.clone().multiplyScalar(dt)
    );

    body.v.add(
      body.a.clone().multiplyScalar(dt)
    );

    body.omega.add(
      body.alpha.clone().multiplyScalar(dt)
    );
  }
}