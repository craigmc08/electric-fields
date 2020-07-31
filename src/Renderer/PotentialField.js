import { ColorRenderer } from './ColorRenderer';
import { hslToRgb } from '../util';

/**
 * 
 * @param {CanvasGraph} ctx 
 * @param {Vector[]} points 
 */
const { render, setupGui } = ColorRenderer((potential, settings) => {
  const mag = Math.abs(potential);
  let v =  Math.pow(mag, settings.displayPower) * settings.displayMultiplier;
  v = Math.floor(v / (100 / settings.levels)) * (100 / settings.levels);

  const h = potential < 0 ? 270 : 20;

  return hslToRgb(h / 360, 100 / 100, v / 100);
}, { displayMultiplier: 0.002, levels: 256 }, 'potential');

export {
  render,
  setupGui
};
