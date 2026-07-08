export function ShotDiagnostics(body, world = null) {
  const contacts = world?.lastContacts ?? [];

  const formattedContacts = contacts.map((contact) => {
    if (contact.type === "rim") {
      return `rim (${contact.rimHitType ?? "unknown"})`;
    }

    if (contact.ccd) {
      return `${contact.type} (ccd, t=${contact.timeOfImpact?.toFixed(3)})`;
    }

    return contact.type;
  });

  const report = {
    scored: body.hasScored,
    scoreType: body.scoreType ?? "none",
    outcomeType: body.outcomeType ?? "none",

    touchedGround: body.touchedGround,
    touchedRim: body.touchedRim,
    touchedBackboard: body.touchedBackboard,

    lastRimHitType: body.lastRimHitType ?? "none",

    contacts: formattedContacts.length > 0 ? formattedContacts : ["none"],

    finalPosition: {
      x: Number(body.position.x.toFixed(3)),
      y: Number(body.position.y.toFixed(3)),
      z: Number(body.position.z.toFixed(3)),
    },

    finalVelocity: {
      x: Number(body.v.x.toFixed(3)),
      y: Number(body.v.y.toFixed(3)),
      z: Number(body.v.z.toFixed(3)),
      speed: Number(body.v.length().toFixed(3)),
    },

    energy: world?.lastEnergyAnalysis?.current
      ? {
          translational: Number(world.lastEnergyAnalysis.current.Kt.toFixed(3)),
          rotational: Number(world.lastEnergyAnalysis.current.Kr.toFixed(3)),
          potential: Number(world.lastEnergyAnalysis.current.U.toFixed(3)),
          total: Number(world.lastEnergyAnalysis.current.E.toFixed(3)),
        }
      : null,
  };

  return report;
}

export function ConsoleShotDiagnostics(body, world = null) {
  const report = ShotDiagnostics(body, world);

  console.group("🏀 Shot Analysis");

  console.log("Scored:", report.scored);
  console.log("Score Type:", report.scoreType);
  console.log("Outcome Type:", report.outcomeType);

  console.log("Touched Ground:", report.touchedGround);
  console.log("Touched Rim:", report.touchedRim);
  console.log("Last Rim Hit:", report.lastRimHitType);
  console.log("Touched Backboard:", report.touchedBackboard);

  console.log("Contacts:", report.contacts);

  console.log("Final Position:");
  console.table(report.finalPosition);

  console.log("Final Velocity:");
  console.table(report.finalVelocity);

  if (report.energy) {
    console.log("Energy:");
    console.table(report.energy);
  }

  console.groupEnd();

  return report;
}