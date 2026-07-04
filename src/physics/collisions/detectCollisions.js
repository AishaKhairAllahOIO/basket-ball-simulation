import { physicsConfig } from "../config/physicsConfig.js";
import { detectGroundCollision } from "./groundCollision.js";
import { detectBackboardCollision } from "./backboardCollision.js";
import { detectRimCollision } from "./rimCollision.js";

export function detectCollisions(body) {
  const contacts = [];

  if (physicsConfig.enabled.groundCollision) {
    const ground = detectGroundCollision(body);
    if (ground) contacts.push(ground);
  }

  if (physicsConfig.enabled.backboardCollision) {
    const backboard = detectBackboardCollision(body);
    if (backboard) {
      body.touchedBackboard = true;
      contacts.push(backboard);
    }
  }

  if (physicsConfig.enabled.rimCollision) {
    const rim = detectRimCollision(body);
    if (rim) {
      body.touchedRim = true;
      contacts.push(rim);
    }
  }

  if (contacts.some((contact) => contact.type === "ground")) {
    body.touchedGround = true;
  }

  return contacts;
}