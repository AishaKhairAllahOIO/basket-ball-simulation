import { GroundContact } from "./GroundContact.js";
import { BackboardContact } from "./BackboardContact.js";
import { RimContact } from "./RimContact.js";

const CCD_ITERATIONS = 10;

function detectAtPosition(body, config, position) {
  const originalPosition = body.position.clone();

  body.position.copy(position);

  const contacts = [];

  const ground = GroundContact(body, config);
  if (ground) contacts.push(ground);

  const backboard = BackboardContact(body, config);
  if (backboard) contacts.push(backboard);

  const rim = RimContact(body, config);
  if (rim) contacts.push(rim);

  body.position.copy(originalPosition);

  return contacts;
}

export function ContinuousCollisionDetection(body, config) {
  if (!config.enabled.continuousCollisionDetection) {
    return [];
  }

  const start = body.previousPosition.clone();
  const end = body.position.clone();

  const displacement = end.clone().sub(start);

  if (displacement.lengthSq() < 1e-12) {
    return [];
  }

  const endContacts = detectAtPosition(body, config, end);

  if (endContacts.length > 0) {
    return endContacts;
  }

  let low = 0;
  let high = 1;
  let foundContacts = [];

  for (let i = 0; i < CCD_ITERATIONS; i++) {
    const mid = (low + high) / 2;

    const testPosition = start
      .clone()
      .add(displacement.clone().multiplyScalar(mid));

    const contacts = detectAtPosition(body, config, testPosition);

    if (contacts.length > 0) {
      foundContacts = contacts;
      high = mid;
    } else {
      low = mid;
    }
  }

  if (foundContacts.length === 0) {
    return [];
  }

  const impactTime = high;

  const impactPosition = start
    .clone()
    .add(displacement.clone().multiplyScalar(impactTime));

  body.position.copy(impactPosition);

  return foundContacts.map((contact) => ({
    ...contact,
    ccd: true,
    timeOfImpact: impactTime,
  }));
}