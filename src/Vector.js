import { lerp } from './math/util';

export default class Vector {
    /**
     * @constructor
     * Creates a new vector
     * @param {number} x The x component of the vector
     * @param {number} y The y component of the vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Creates a vector with an angle and length
     * @param {number} angle Angle (in radians) of vector counter-clockwise from x-axis
     * @param {number} length Length of the vector
     * @returns {Vector}
     */
    static FromAngle(angle, length=1) {
        return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    /**
     * Adds another vector to this one
     * @param {number} other A vector to add to this one
     * @returns {Vector}
     */
    add({ x , y }) {
        return new Vector(this.x + x, this.y + y);
    }
    /**
     * Subtracts another vector from this one
     * @param {number} other A vector to subtract from this one
     * @returns {Vector}
     */
    subtract({ x, y }) {
        return new Vector(this.x - x, this.y - y);
    }

    /**
     * Scales x and y components of vector individually
     * @param {number} i Scale for x
     * @param {number} j Scale for y
     * @returns {Vector}
     */
    scaleXY(i, j) {
        return new Vector(this.x * i, this.y * j);
    }
    /**
     * Scales vector uniformly on x and y
     * @param {number} i Scalar to multiply vector by
     * @return {Vector}
     */
    scale(i) {
        return this.scaleXY(i, i);
    }
    /**
     * Computes the dot product of this and another vector
     * @param {Vector} other Vector to dot product with
     * @returns {number}
     */
    dot({ x, y }) {
        return this.x * x + this.y * y;
    }
    /**
     * Rotates this vector by specified angle (positive = counter-clockwise)
     * @param {number} angle Angle (in radians) to rotate vector by
     * @returns {Vector}
     */
    rotate(angle) {
        const base_angle = Math.atan2(this.y, this.x);
        const new_angle = base_angle + angle;
        const length = this.mag();
        return new Vector(Math.cos(new_angle) * length, Math.sin(new_angle) * length);
    }
    /**
     * Sets the angle (counter-clockwise from x-axis) of the vector
     * @param {number} angle Angle (in radians)
     * @returns {Vector}
     */
    setAngle(angle) {
        const length = this.mag();
        return new Vector(Math.cos(angle) * length, Math.sign(angle) * length);
    }
    /**
     * Computes the angle of the vector
     * @returns {number} Angle in radians
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Computes the square of the magnitude of the vector (faster)
     * @returns {number}
     */
    sqrMag() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Computes the magnitude of the vector (slower)
     * @returns {number}
     */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Normalizes the vector (same direction, length of 1)
     * @returns {Vector}
     */
    normalize() {
        const mag = this.mag();
        if (mag === 0) return Vector.zero;
        return this.scale(1 / this.mag());
    }

    /**
     * Computes the square of the distance between the 2 vectors (faster)
     * @param {Vector} v1 First vector
     * @param {Vector} v2 Second vector
     * @returns {number}
     */
    static SqrDist(v1, v2) {
        return v1.subtract(v2).sqrMag();
    }
    /**
     * Computes the distance between the 2 vectors (slower)
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {number}
     */
    static Dist(v1, v2) {
        return v1.subtract(v2).mag();
    }

    /**
     * Lerps between two vectors
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @param {number} t 
     * @returns {Vector}
     */
    static Lerp(v1, v2, t) {
        return new Vector(lerp(v1.x, v2.x, t), lerp(v1.y, v2.y, t));
    }

    /**
     * Returns a copy of this vector
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y);
    }

    /**
     * Check equality of this vector with another value
     * 
     * @param {any} b
     */
    equals(b) {
        if (typeof b !== 'object') return;
        return this.x === b.x && this.y === b.y;
    }

    /**
     * Check equality of two vectors
     * 
     * @param {Vector} v1 
     * @param {Vector} v2 
     */
    static Equal(v1, v2) {
        return v1.equals(v2);
    }
}

Vector.zero = new Vector(0, 0);
