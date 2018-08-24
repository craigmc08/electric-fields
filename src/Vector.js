const Vector = (x, y) => ({ x: x, y: y });
const V = Vector;

const Add = Vector.Add = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => V(x1 + x2, y1 + y2);
const Subtract = Vector.Subtract = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => V(x1 - x2, y1 - y2);

const Scale = Vector.Scale = ({ x, y }, i, j) => j === undefined ? V(x * i, y * i) : V(x * i, y * j);
const Dot = Vector.Dot = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 * x2 + y1 * y2;

const FromAngle = Vector.FromAngle = (a) => V(Math.cos(a), Math.sin(a));
const Angle = Vector.Angle = ({ x, y }) => Math.atan2(y, x);

const SqrMag = Vector.SqrMag = ({ x, y }) => x*x + y*y;
const Mag = Vector.Mag = (v) => Math.sqrt(SqrMag(v));
const SqrDist = Vector.SqrDist = (v1, v2) => SqrMag(Subtract(v1, v2));
const Dist = Vector.Dist = (v1, v2) => Mag(Subtract(v1, v2));

const Normalize = Vector.Normalize = (v) => Scale(v, (1 / Mag(v)));

const Copy = Vector.Copy = ({ x, y }) => V(x, y);

export default Vector;