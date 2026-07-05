export class ExplicitEuler {
  step(body, dt) {
    body.previousPosition.copy(body.position);

    body.position.add(
      body.v.clone().multiplyScalar(dt)
    );

    body.v.add(
      body.a.clone().multiplyScalar(dt)
    );

    body.omega.add(
      body.alpha.clone().multiplyScalar(dt)
    );
  }
}