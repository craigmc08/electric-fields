import V from './Vector';

/**
 * Generates a random float between min and max
 * @param {number} min inclusive
 * @param {number} max exclusive
 * @returns {number}
 */
const Range = (min, max) => max === undefined ? Math.random() * min : Math.random() * (max - min) + min;
/**
 * Generates a random between min and max
 * @param {number} min inclusive
 * @param {number} max exclusive
 * @returns {number}
 */
const RangeInt = (min, max) => Math.floor(Range(min, max));
/**
 * Returns the given number with a random sign (+/-)
 * @param {number} num
 * @returns {number}
 */
const Sign = num => num * (Math.floor(Math.random() * 2) * 2 - 1);
/**
 * Returns a random vector within the range
 * @param {number} min Minimum x
 * @param {number} max Maximum x
 * @param {number} [minY] Minimum y (if not set, it equals min)
 * @param {number} [maxY] Maximum y (if not set, it equals max)
 * @returns {Vector}
 */
const Position = (min, max, minY=min, maxY=max) => new V(Range(min, max), Range(minY, maxY));
/**
 * Returns a random unit vector
 * @returns {Vector}
 */
const Direction = () => V.FromAngle(Range(0, 2 * Math.PI));

export default {
    Range,
    RangeInt,
    Sign,
    Position,
    Direction,
};