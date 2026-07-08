export function NetContact(body, config) 
{
  const rim = config.court.hoop;
  const net = config.court.net;

  const rimRadius = rim.rimInnerDiameter / 2;

  const dx = body.position.x - rim.x;
  const dz = body.position.z - rim.z;
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

  const isInsideNet =
    horizontalDistance < rimRadius &&
    body.position.y < rim.y &&
    body.position.y > rim.y - net.height;

  return {
    isInsideNet,
  };
}