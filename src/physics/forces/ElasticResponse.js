export function ElasticResponse(contact, body) 
{
  const n = contact.normal.clone().normalize();
  const vn = body.v.dot(n);

  return Math.max(
    0,
    contact.stiffness * contact.penetrationDepth - contact.damping * vn
  );
}