export function Momentum(body) 
{
  const p = body.v.clone().multiplyScalar(body.m);
  const L = body.omega.clone().multiplyScalar(body.I);

  return {
    linear: p,
    angular: L,
  };
}