import { SimulationDiagnostics } from "./SimulationDiagnostics.js";

export function ConsolePhysicsTest(body) {
  const report = SimulationDiagnostics(body);

  console.clear();

  console.group("🏀 Basketball Physics");

  console.table(report.position);

  console.table(report.velocity);

  console.table(report.angularVelocity);

  console.table(report.energy);

  console.table(report.forces.force);

  console.table(report.forces.acceleration);

  console.table(report.forces.torque);

  console.table(report.forces.angularAcceleration);

  console.table(report.contacts);

  console.log("Scored :", report.score);

  console.groupEnd();
}