import * as THREE from "three";

export function StaticFriction() {
  return {
    Ff: new THREE.Vector3(),
    tau: new THREE.Vector3(),
    mode: "not-implemented-full-static-friction",
  };
}