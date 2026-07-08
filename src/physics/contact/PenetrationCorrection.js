export function PenetrationCorrection(body, contacts, config) 
{
  if (!config.enabled.penetrationCorrection) return;

  const beta = 0.8;

  for (const contact of contacts) 
  {
    if (contact.penetrationDepth <= 0) continue;

    body.position.add(contact.normal.clone().normalize().multiplyScalar(contact.penetrationDepth * beta));
  }
}