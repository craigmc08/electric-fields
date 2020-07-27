import PointCharge from '../PointCharge';
import V from '../Vector';

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
export default function Render(cg, points) {
  /** @type {CanvasRenderingContext2D} */
  const ctx = cg.ctx;
  const { width, height } = ctx.canvas;

  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += GRID_SIZE) {
    for (let x = 0; x < width ; x += GRID_SIZE) {
      const pos = new V(x, y);
      /** @type V */
      let field = points.reduce((total, point) => total.add(point.field(pos)), new V(0, 0));
      if (IGNORE_SCALE) field = field.normalize();
      else {
        const x = field.mag();
        field = field.scale(FIELD_SCALE(x) / x);
      }

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
      lineTo(field.x * ARROW_LENGTH, field.y * ARROW_LENGTH);
      lineTo(SQ_SIZE / 2, SQ_SIZE / 2);
      lineTo(-SQ_SIZE, 0);
      lineTo(0, -SQ_SIZE);
      lineTo(SQ_SIZE, 0);
      lineTo(0, SQ_SIZE);
      lineTo(-SQ_SIZE / 2, -SQ_SIZE / 2);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}
