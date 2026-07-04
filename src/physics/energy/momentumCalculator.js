export function calculateLinearMomentum(body) 
{
  return body.velocity.clone().multiplyScalar(body.mass);
}

export function calculateAngularMomentum(body) 
{
  return body.angularVelocity.clone().multiplyScalar(body.inertia);
}