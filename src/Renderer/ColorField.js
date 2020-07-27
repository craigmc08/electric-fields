import { hslToRgb } from '../util'
import ColorRenderer from './ColorRenderer';

const FIELD_DISPLAY_MULT = 0.015;
const FIELD_DISPLAY_POWER = 0.5;
const FIELD_MAG_TIERS = 500;

/**
 * 
 * @param {CanvasGraph} ctx 
 * @param {Vector[]} points 
 */
export default ColorRenderer(field => {
  const a = field.angle() + Math.PI;
  const a_pos = a < 0 ? Math.PI * 2 + a : a;
  const a_8bit = Math.floor(a_pos / Math.PI * 180);
  const hue = (a_8bit + 180) % 360;

  const mag = field.mag();
  let v =  Math.pow(mag, FIELD_DISPLAY_POWER) * FIELD_DISPLAY_MULT;
  v = Math.floor(v / (100 / FIELD_MAG_TIERS)) * (100 / FIELD_MAG_TIERS);

  return hslToRgb(hue / 360, 100 / 100, v / 100);
})
