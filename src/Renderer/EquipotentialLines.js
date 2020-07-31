import PointCharge from '../PointCharge';
import Vector from '../Vector';
import { gridToIsoline } from '../math/contour';
import { potentialAt, lerp } from '../math/util';

const settings = {
  levels: 3,
  resolution: 200
};

/**
 * @param {import('dat.gui').GUI} gui  
 */
function setupGui(gui, onChange) {
  gui.add(settings, 'levels').min(1).max(10).step(1).onChange(onChange);
  gui.add(settings, 'resolution').min(1).max(500).step(1).onChange(onChange);
}

/**
 * @param {CanvasGraph} cg
 * @param {PointCharge[]} points 
 */
function render(cg, points) {
  /** @type {CanvasRenderingContext2D} */
  const ctx = cg.ctx;
  const { width, height } = ctx.canvas;

  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  if (points.length === 0) return;

  const cellSize = width / settings.resolution;
  const gridWidth = settings.resolution;
  const gridHeight = Math.ceil(height / width * settings.resolution);

  const grid = [];
  for (let y = 0; y < gridHeight; y++) {
    grid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      const pos = new Vector(x * cellSize, y * cellSize);
      grid[y][x] = points.reduce(
        (total, point) => total + (point.potential(pos)), 0
      );
    }
  }

  let maxNegativeLevel = 0;
  let maxPositiveLevel = 0;
  for (let i = 0; i < points.length; i++) {
    const level = potentialAt(points, points[i].pos.add(new Vector(30, 0)));
    if (level < maxNegativeLevel) maxNegativeLevel = level;
    if (level > maxPositiveLevel) maxPositiveLevel = level;
  }

  const midLevel = (maxPositiveLevel + maxNegativeLevel) / 2;

  ctx.strokeStyle = 'white';
  for (let i = 0; i < settings.levels * 2 + 1; i++) {
    const highLevel = i % 2 === 0 ? maxPositiveLevel : maxNegativeLevel;
    const level = (highLevel - midLevel) * Math.floor((i + 1) / 2) / settings.levels + midLevel;

    const { contour } = gridToIsoline(grid, level);
    
    ctx.lineWidth = '2';
    ctx.beginPath();
    contour.forEach(([a, b]) => {
      ctx.moveTo(a.x * cellSize, a.y * cellSize);
      ctx.lineTo(b.x * cellSize, b.y * cellSize);
    });
    ctx.stroke();
  }
}

export {
  render,
  setupGui
};
