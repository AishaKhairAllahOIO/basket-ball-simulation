export function ElasticEnergy(contact) {
  if (!contact || contact.penetrationDepth <= 0) {
    return {
      stored: 0,
      dissipatedPower: 0,
    };
  }

  const delta = contact.penetrationDepth;
  const k = contact.stiffness;
  const c = contact.damping;
  const vn = contact.normalVelocity ?? 0;

  const stored = 0.5 * k * delta * delta;
  const dissipatedPower = c * vn * vn;

  return {
    stored,
    dissipatedPower,
  };
}