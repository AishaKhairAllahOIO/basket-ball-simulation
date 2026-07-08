import { getContactPointVelocity } from "../forces/KineticFriction.js";

const EPSILON = 1e-3;

export function RollingStateDetector(body, contacts = []) {
  const groundContact = contacts.find((contact) => contact.type === "ground");

  if (!groundContact) {
    return {
      state: "not-on-ground",
      isRolling: false,
      isSliding: false,
      contactSpeed: null,
      rollingCondition: null,
    };
  }

  const vContact = getContactPointVelocity(
    body,
    groundContact.contactPoint
  );

  const n = groundContact.normal.clone().normalize();

  const vNormal = n.clone().multiplyScalar(vContact.dot(n));
  const vTangential = vContact.clone().sub(vNormal);

  const contactSpeed = vTangential.length();

  const linearSpeed = Math.sqrt(body.v.x * body.v.x + body.v.z * body.v.z);

  const rollingSpeed = body.omega.length() * body.R;

  const rollingCondition = Math.abs(linearSpeed - rollingSpeed);

  if (contactSpeed < EPSILON || rollingCondition < EPSILON) 
  {
    return {
      state: "rolling-without-slipping",
      isRolling: true,
      isSliding: false,
      contactSpeed,
      rollingCondition,
    };
  }

  return {
    state: "sliding",
    isRolling: false,
    isSliding: true,
    contactSpeed,
    rollingCondition,
  };
}