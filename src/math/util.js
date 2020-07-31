import Vector from '../Vector';

/**
 * Linearly interpolates betweeen two numbers
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 */
export function lerp(a, b, t) {
  return (b - a) * t + a;
}

/**
 * Finds a value t such that lerp(a, b, t) = c
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} c Liner interpolation of a b
 */
export function inverseLerp(a, b, c) {
  if (a - b === 0) return 0.5;
  return (c - a) / (b - a);
}

/**
 * Clamps a value v between mi and ma
 * 
 * @param {number} v 
 * @param {number} mi 
 * @param {number} ma 
 */
export function clamp(v, mi, ma) {
  return Math.min(Math.max(v, mi), ma);
}

/**
 * Finds total potential from all point charges at a location
 * @param {import('../PointCharge').default[]} points 
 * @param {Vector} pos
 */
export function potentialAt(points, pos) {
  return points.reduce((acc, p) => acc + p.potential(pos), 0);
}

/**
 * 
 * @param {import('../PointCharge').default[]} points 
 * @param {Vector} pos 
 */
export function fieldAt(points, pos) {
  return points.reduce((acc, p) => acc.add(p.field(pos)), Vector.zero);
}
