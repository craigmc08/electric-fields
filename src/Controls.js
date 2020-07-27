import Observable from './Observable';

/**
 * Defines the following events:
 * - `redraw`: Redraw is triggered. Always redraw when this is triggered.
 * - `settings-change`: A render setting is changed, passes the new settings as the argument
 * - `add`: When a point is requested to be made, passes { charge: number, location: Vector }
 *          as the argument. Handler should return an id for the point
 * - `delete`: A request to delete a point is made, passes the point id as an argument
 * - `update`: A request to update a point is made, passes
 *             { id: any, charge?: number, location?: Vector } as the argument
 */
export class Controls extends Observable {
  constructor() {
    super();

    this.addBtn = document.querySelector('#add-point');
  }
}
