export function Energy(body, config) {
  const g = config?.environment?.g ?? 9.81;

  const Kt = 0.5 * body.m * body.v.lengthSq();
  const Kr = 0.5 * body.I * body.omega.lengthSq();
  const U = body.m * g * body.position.y;
  const E = Kt + Kr + U;

  return {
    Kt,
    Kr,
    U,
    E,
  };
}