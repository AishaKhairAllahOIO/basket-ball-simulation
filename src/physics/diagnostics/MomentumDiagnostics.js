import { Momentum } from "../dynamics/Momentum.js";

export function MomentumDiagnostics(body) {
  const momentum = Momentum(body);

  return {
    linear: {
      x: momentum.linear.x,
      y: momentum.linear.y,
      z: momentum.linear.z,
      magnitude: momentum.linear.length(),
    },

    angular: {
      x: momentum.angular.x,
      y: momentum.angular.y,
      z: momentum.angular.z,
      magnitude: momentum.angular.length(),
    },
  };
}