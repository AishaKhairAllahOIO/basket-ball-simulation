import { physicsConfig } from "../config/physicsConfig.js";

export function correctPenetration(body, contacts) {
  if (!physicsConfig.enabled.penetrationCorrection) {
    return;
  }

  const beta = physicsConfig.contact.penetrationCorrectionFactor;

  for (const contact of contacts) {
    if (contact.penetrationDepth <= 0) continue;

    body.position.add(
      contact.normal
        .clone()
        .normalize()
        .multiplyScalar(contact.penetrationDepth * beta)
    );
  }
}