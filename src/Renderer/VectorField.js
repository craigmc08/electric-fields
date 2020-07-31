import PointCharge from '../PointCharge';
import V from '../Vector';
import { rgb } from '../util';

const settings = {
  gridSize: 25,
  scaleField: false,
  arrowLength: 10,
  squareSize: 3,
  color1: [0, 0, 255],
  color2: [0, 255, 0],
  color3: [255, 0, 0],
  color4: [255, 255, 255],
};

/**
 * @param {import('dat.gui').GUI} gui 
 */
function setupGui(gui, onChange) {
  gui.add(settings, 'gridSize').min(5).max(100).step(5).onChange(onChange);
  gui.add(settings, 'scaleField').onChange(onChange);
  gui.add(settings, 'arrowLength').min(1).step(1).onChange(onChange);
  const colors = gui.addFolder('Arrow Colors');
  colors.addColor(settings, 'color1').onChange(onChange);
  colors.addColor(settings, 'color2').onChange(onChange);
  colors.addColor(settings, 'color3').onChange(onChange);
  colors.addColor(settings, 'color4').onChange(onChange);
}

const GRID_SIZE = 25;
const IGNORE_SCALE = true;
const FIELD_SCALE = l => 0.5 * Math.pow(l, 0.1);
const ARROW_LENGTH = 10;
const SQ_SIZE = 3;

/**
 * 
 * @param {CanvasGraph} ctx 
 * @param {Vector[]} points 
 */
function render(cg, points) {
  /** @type {CanvasRenderingContext2D} */
  const ctx = cg.ctx;
  const { width, height } = ctx.canvas;

  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // TODO: figure out how to get a min/Max that's reasonable when there is
  // one or two huge things
  // 90th percentile or something?
  const vectors = [];
  let minMag = Infinity
  let maxMag = -Infinity;
  for (let y = 0; y < height; y += settings.gridSize) {
    vectors[y] = [];
    for (let x = 0; x < width; x += settings.gridSize) {
      const pos = new V(x, y);
      /** @type V */
      const field = points.reduce((total, point) => total.add(point.field(pos)), new V(0, 0));
      const mag = field.mag();


      vectors[y][x] = field;
      if (mag < minMag) minMag = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }

  for (let y = 0; y < height; y += settings.gridSize) {
    for (let x = 0; x < width ; x += settings.gridSize) {
      const pos = new V(x, y);
      /** @type V */
      let field = vectors[y][x];
      const mag = field.mag();
      if (!settings.scaleField) field = field.normalize();
      else {
        field = field.scale(FIELD_SCALE(mag) / mag);
      }

      const magPower = 0.5;
      const magLevel = Math.floor(Math.pow((mag - minMag) / (maxMag - minMag) * Math.pow(4, 1/magPower), magPower));
      const colorRGB = {
        0: settings.color1,
        1: settings.color2,
        2: settings.color3,
        3: settings.color4,
        4: settings.color4,
      }[magLevel];
      const color = rgb(...colorRGB);

      const lineFrom = (sx, sy) => {
        ctx.moveTo(sx, sy);
        let x = sx;
        let y = sy;
        return (dx, dy) => {
          ctx.lineTo(x + dx, y + dy);
          x = x + dx;
          y = y + dy;
        }
      };

      ctx.beginPath();
      const lineTo = lineFrom(pos.x, pos.y);
      lineTo(field.x * settings.arrowLength, field.y * settings.arrowLength);
      // const sqSize = settings.squareSize;
      // lineTo(sqSize / 2, sqSize / 2);
      // lineTo(-sqSize, 0);
      // lineTo(0, -sqSize);
      // lineTo(sqSize, 0);
      // lineTo(0, sqSize);
      // lineTo(-sqSize / 2, -sqSize / 2);
      // ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}

export {
  render,
  setupGui
}
