import { shouldBounce, applyRestitution } from "./Restitution.js";

export function ImpulseSolver(body, contacts) 
{
  for (const contact of contacts) 
  {
    const normal = contact.normal.clone().normalize();

    const vn = body.v.dot(normal);

    if (!shouldBounce(vn)) 
    {
      continue;
    }

    const newNormalVelocity = applyRestitution(vn, contact.e);

    const deltaVelocity = newNormalVelocity - vn;

    const impulseMagnitude = body.m * deltaVelocity;

    const impulse = normal.clone().multiplyScalar(impulseMagnitude);

    body.v.add(impulse.clone().divideScalar(body.m));
  }
}