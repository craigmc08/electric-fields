import PointCharge from '../PointCharge';
import Vector from '../Vector';
import { gridToIsoline } from '../math/contour';
import { fieldAt, lerp, potentialAt } from '../math/util';
import { hsl, hslToRgb, rgb, arraysEqualBy, deepCopy } from '../util';

const settings = {
  resolution: 200,
  subCellSampling: 2,
  level: 0,
  integrateFromPrevious: false,
};

/**
 * @param {import('dat.gui').GUI} gui  
 */
function setupGui(gui, onChange) {
  gui.add(settings, 'resolution').min(1).max(500).step(1).onChange(onChange);
  gui.add(settings, 'subCellSampling').min(1).max(10).step(1).onChange(onChange);
  gui.add(settings, 'level').step(1).onChange(onChange);
  gui.add(settings, 'integrateFromPrevious').onChange(onChange);
}

// For cacheing the very expensive to compute grid
let lastPoints = null;
let lastGrid = null;
let lastResolution = -1;
let lastSubCellSampling = -1;
let lastIntegrateFromPrevious = -1;

function computeGrid(points, cellSize, gridWidth, gridHeight, settings) {
  const dt = cellSize / settings.subCellSampling;

  const grid = [];
  for (let y = 0; y < gridHeight; y++) {
    grid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      if (x === 0 && y === 0) {
        grid[y][x] = 0;
        continue;
      }

      const pos = new Vector(x * cellSize, y * cellSize);
      // see StreamMath.pdf for how this (should) work
      // also reference:
      // - https://en.wikipedia.org/wiki/Gradient_theorem
      // - https://en.wikipedia.org/wiki/Line_integral#Line_integral_of_a_vector_field
      // - https://aip.scitation.org/doi/pdf/10.1063/1.168384

      // this solution doesn't work yet, and will never be free of artifactions:
      // some integration paths will cross over or get very close to points of
      // infinite charge density
      // possible solution: use circular charge disks with a finite charge
      // density
      // for charged disk: same field for outside the circle, but zero field
      // inside the circle

      if (!settings.integrateFromPrevious) {
        const xmag = pos.mag();
        const xhat = pos.scale(1 / xmag);
        let value = 0;
        for (let t = 0; t < xmag; t += dt) {
          const xt = xhat.scale(t);
          const field = fieldAt(points, xt);
          value += (-xhat.x * field.y + xhat.y * field.x) * dt;
        }
        grid[y][x] = value;
      } else {
        const yStart = x === 0 ? y - 1 : y;
        const xStart = x === 0 ? x : x - 1;
        const startPos = x === 0 ? new Vector(pos.x, pos.y - cellSize) : new Vector(pos.x - cellSize, pos.y);

        const l = pos.subtract(startPos);
        const lmag = l.mag();
        const lhat = l.scale(1 / lmag);
        let value = grid[yStart][xStart];
        for (let t = 0; t < lmag; t += dt) {
          const xt = lhat.scale(t).add(startPos);
          const field = fieldAt(points, xt);
          value += (-lhat.x * field.y + lhat.y * field.x) * dt;
        }
        grid[y][x] = value;
      }

      grid[y][x] *= 0.0000005;
    }
  }

  return grid;
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

  const settingsChanged = lastResolution !== settings.resolution
    || lastSubCellSampling !== settings.subCellSampling
    || lastIntegrateFromPrevious !== settings.integrateFromPrevious;
  const pointsChanged = !arraysEqualBy(
    (a, b) => a.pos.x === b.pos.x && a.pos.y === b.pos.y && a.charge === b.charge,
    lastPoints,
    points,
  );

  let grid = lastGrid;
  if (settingsChanged || pointsChanged) {
    grid = computeGrid(points, cellSize, gridWidth, gridHeight, settings);
    lastPoints = deepCopy(points);
    lastGrid = grid;
    lastResolution = settings.resolution;
    lastSubCellSampling = settings.subCellSampling;
    lastIntegrateFromPrevious = settings.integrateFromPrevious;
  }

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const h = grid[y][x] < 0 ? 270 : 50;
      const v = Math.pow(Math.abs(grid[y][x]), 0.5) / 100;
      ctx.fillStyle = rgb(...hslToRgb((grid[y][x] / 10) % 1, 0.7, 0.5));
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  const lines = gridToIsoline(grid, settings.level).contour;

  for (let i = 1; i < 0; i++) {
    const { contour: contour1 } = gridToIsoline(grid, i / 8 * 100);
    const { contour: contour2 } = gridToIsoline(grid, -i / 8 * 100);
    lines.push(...contour1, ...contour2);
  }

  ctx.lineWidth = '2';
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  lines.forEach(([a, b]) => {
    ctx.moveTo(a.x * cellSize, a.y * cellSize);
    ctx.lineTo(b.x * cellSize, b.y * cellSize);
  });
  ctx.stroke();
}

export {
  render,
  setupGui
};
