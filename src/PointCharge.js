import Vector from './Vector';

const k = 8.99e9;
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
    }

    /**
     * Computes the magnitude of the electric field at a point (faster)
     * @param {Vector} point The point to compute the field at
     * @returns {number}
     */
    fieldMag(point) {
        return k * this.charge / Vector.SqrDist(point, this.pos);
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
     * Computes the electrostatic force on a point charge
     * @param {PointCharge} other Point charge to compute the force for
     */
    force(other) {
        return this.field(other.pos).scale(other.charge);
    }
}
PointCharge.k = k;