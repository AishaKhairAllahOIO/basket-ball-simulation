import { GroundContact } from "./GroundContact.js";
import { BackboardContact } from "./BackboardContact.js";
import { RimContact } from "./RimContact.js";

export function ContactManager(body, config) 
{
  const contacts = [];

  if (config.enabled.contact) 
  {
    const ground = GroundContact(body, config);
    if (ground) 
    {
      body.touchedGround = true;
      contacts.push(ground);
    }

    const backboard = BackboardContact(body, config);
    if (backboard) 
    {
      body.touchedBackboard = true;
      contacts.push(backboard);
    }

    const rim = RimContact(body, config);
    if (rim)
    {
      body.touchedRim = true;
      body.lastRimHitType = rim.rimHitType;
      contacts.push(rim);
    }
  }

  return contacts;
}