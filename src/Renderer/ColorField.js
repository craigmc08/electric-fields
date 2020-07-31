import { hslToRgb } from '../util'
import { ColorRenderer } from './ColorRenderer';

/**
 * 
 * @param {CanvasGraph} ctx 
 * @param {Vector[]} points 
 */
const { render, setupGui } = ColorRenderer((field, settings) => {
  const a = field.angle() + Math.PI;
  const a_pos = a < 0 ? Math.PI * 2 + a : a;
  const a_8bit = Math.floor(a_pos / Math.PI * 180);
  const hue = (a_8bit + 180) % 360;

  const mag = field.mag();
  let v =  Math.pow(mag, settings.displayPower) * settings.displayMultiplier;
  v = Math.floor(v / (100 / settings.levels)) * (100 / settings.levels);

  return hslToRgb(hue / 360, 100 / 100, v / 100);
}, { levels: 256 }, 'field');

export {
  render,
  setupGui
}
