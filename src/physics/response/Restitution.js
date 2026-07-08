
export function applyRestitution(normalVelocity, restitution) 
{
  return -restitution * normalVelocity;
}


export function shouldBounce(normalVelocity) 
{
  return normalVelocity < 0;
}