import ColorRenderer from './ColorRenderer';
import { hslToRgb } from '../util';

const FIELD_DISPLAY_MULT = 0.002;
const FIELD_DISPLAY_POWER = 0.5;
const FIELD_MAG_TIERS = 500;

/**
 * 
 * @param {CanvasGraph} ctx 
 * @param {Vector[]} points 
 */
export default ColorRenderer((potential) => {
  const mag = Math.abs(potential);
  let v =  Math.pow(mag, FIELD_DISPLAY_POWER) * FIELD_DISPLAY_MULT;
  v = Math.floor(v / (100 / FIELD_MAG_TIERS)) * (100 / FIELD_MAG_TIERS);

  const h = potential < 0 ? 270 : 20;

  return hslToRgb(h / 360, 100 / 100, v / 100);
}, true);
