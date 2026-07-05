import * as THREE from "three";

export function BackboardContact(body, config) {
  const board = config.court.backboard;

  const normal = new THREE.Vector3(board.normalDirection, 0, 0).normalize();
  const signedDistance = (body.position.x - board.x) * board.normalDirection;

  if (signedDistance >= body.R) return null;

  const insideY =
    body.position.y >= board.y - board.height / 2 - body.R &&
    body.position.y <= board.y + board.height / 2 + body.R;

  const insideZ =
    body.position.z >= board.z - board.width / 2 - body.R &&
    body.position.z <= board.z + board.width / 2 + body.R;

  if (!insideY || !insideZ) return null;

  return {
    type: "backboard",
    normal,
    penetrationDepth: body.R - signedDistance,
    contactPoint: new THREE.Vector3(board.x, body.position.y, body.position.z),
    stiffness: board.stiffness,
    damping: board.damping,
    e: config.ball.restitution.backboard,
    muS: 0.35,
    muK: 0.25,
  };
}