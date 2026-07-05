import * as THREE from "three";

export function GroundContact(body, config) {
  const ground = config.court.ground;
  const bottomY = body.position.y - body.R;

  if (bottomY >= ground.y) return null;

  return {
    type: "ground",
    normal: new THREE.Vector3(0, 1, 0),
    penetrationDepth: ground.y - bottomY,
    contactPoint: new THREE.Vector3(body.position.x, ground.y, body.position.z),
    stiffness: ground.stiffness,
    damping: ground.damping,
    e: config.ball.restitution.ground,
    muS: config.ball.friction.muS,
    muK: config.ball.friction.muK,
  };
}