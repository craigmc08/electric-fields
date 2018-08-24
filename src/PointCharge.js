import V from './Vector';

const PointCharge = (p, charge, v=V(0, 0)) => ({ p, v, charge });
const P = PointCharge;

const k = PointCharge.k = 8.99e9;
const e0 = PointCharge.e0 = 8.85e-12;

const FieldMag = PointCharge.FieldMag = (point, { p, charge }) => k * charge / V.SqrDist(p, point);
const Field = PointCharge.Field = (point, pc) => V.Scale(V.Normalize(V.Subtract(pc.p, point)), FieldMag(point, pc));

const Force = PointCharge.Force = (p1, { p, charge }) => Field(p, p1) * charge;

const ApplyForce = PointCharge.ApplyForce = dt => F => ({ p, charge, v }) => P(p, charge, V.Add(v, V.Scale(F, dt)));
const Update = PointCharge.Update = dt => ({ p, charge, v }) => P(V.Add(p, V.Scale(v, dt)), charge, v);

export default PointCharge;