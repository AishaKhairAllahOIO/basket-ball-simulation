export class RungeKutta4 {
  step(body, dt) {
    body.previousPosition.copy(body.position);

    const k1v = body.a.clone().multiplyScalar(dt);
    const k1x = body.v.clone().multiplyScalar(dt);

    const k2v = body.a.clone().multiplyScalar(dt);
    const k2x = body.v.clone().add(k1v.clone().multiplyScalar(0.5)).multiplyScalar(dt);

    const k3v = body.a.clone().multiplyScalar(dt);
    const k3x = body.v.clone().add(k2v.clone().multiplyScalar(0.5)).multiplyScalar(dt);

    const k4v = body.a.clone().multiplyScalar(dt);
    const k4x = body.v.clone().add(k3v).multiplyScalar(dt);

    body.position.add(
      k1x
        .add(k2x.multiplyScalar(2))
        .add(k3x.multiplyScalar(2))
        .add(k4x)
        .multiplyScalar(1 / 6)
    );

    body.v.add(
      k1v
        .add(k2v.multiplyScalar(2))
        .add(k3v.multiplyScalar(2))
        .add(k4v)
        .multiplyScalar(1 / 6)
    );

    body.omega.add(
      body.alpha.clone().multiplyScalar(dt)
    );
  }
}