import Vector from './Vector';

const k = 9e9;
/**
 * Technically this isn't a point charge anymore, but a small circular charge
 * to avoid problematic infinity discontinuities
 */
export default class PointCharge {
    /**
     * @constructor
     * Creates a point charge at a position and charge
     * @param {Vector} position 
     * @param {number} charge Charge (in Coloumbs) of the point charge
     */
    constructor(position, charge) {
        /** @member {Vector} pos Position */
        this.pos = position;
        /** @member {number} charge Charge (in Coloumbs)*/
        this.charge = charge;

        /** @member {number} radius Radius */

        /** @member {number} _radius Private radius, dont modify directly */
        this._radius = 2;
        /** @member {number} sqrRadius Radius squared */
        this.sqrRadius = this.radius * this.radius;
    }

    set radius(value) {
        this._radius = value;
        this.sqrRadius = value * value;
    }
    get radius() {
        return this._radius;
    }

    /**
     * Computes the magnitude of the electric field at a point (faster)
     * @param {Vector} point The point to compute the field at
     * @returns {number}
     */
    fieldMag(point) {
        const sqrDist = Vector.SqrDist(point, this.pos);
        if (sqrDist < this.sqrRadius) return 0;
        return k * this.charge / sqrDist;
    }
    /**
     * Computes the vector representing the electric field at a point
     * @param {Vector} point The point to compute the field at
     * @returns {Vector}
     */
    field(point) {
        return point.subtract(this.pos).normalize().scale(this.fieldMag(point));
    }
    /**
     * Computes the vector representing the electric field, but assuming all charges are +
     * @param {Vector} point
     * @returns {Vector}
     */
    fieldPositive(point) {
        return point.subtract(this.pos).normalize().scale(Math.abs(this.fieldMag(point)));
    }

    /**
     * Computes the normalized direction vector of the field
     * @param {Vector} point
     * @returns {Vector}
     */
    fieldDir(point) {
        point.subtract(this.pos).normalize();
    }

    /**
     * Computes the potential at a point due to this point charge
     * @param {Vector} point 
     */
    potential(point) {
        const dist = Math.max(Vector.Dist(point, this.pos), this.radius);
        return k * this.charge / dist;
    }

    /**
     * Computes the electrostatic force on a point charge
     * @param {PointCharge} other Point charge to compute the force for
     */
    force(other) {
        return this.field(other.pos).scale(other.charge);
    }
}
PointCharge.k = k;
