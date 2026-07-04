export function resolvePenetration(body, contacts, correctionPercent = 0.8) {
  for (const contact of contacts) {
    if (!contact || contact.penetrationDepth <= 0) continue;

    body.position.add(
      contact.normal
        .clone()
        .normalize()
        .multiplyScalar(contact.penetrationDepth * correctionPercent)
    );
  }
}