import Vector from '../Vector';
import { inverseLerp } from './util';

const V = (x, y) => new Vector(x, y);

/**
 * LUT for an isoline returns a function that takes the estimated midpoint of
 * each side
 * 
 * Returns pairs of points representing a line in the contour
 * 
 * Labeled contour cell diagram:
 * 
 * ```txt
 * d - a
 * |   |
 * c - b
 * ```
 * 
 * Side level order: ab, cb, dc, da
 * 
 * @type {((ab: Vector, cb: Vector, dc: Vector, da: Vector) => Vector[][])[]}
 */
const isolineLUT = {
  0: (ab, cb, dc, da) => [],
  1: (ab, cb, dc, da) => [[dc, cb]],
  2: (ab, cb, dc, da) => [[cb, ab]],
  3: (ab, cb, dc, da) => [[dc, ab]],
  4: (ab, cb, dc, da) => [[da, ab]],
  5: (ab, cb, dc, da) => [[dc, da], [cb, ab]],
  6: (ab, cb, dc, da) => [[da, cb]],
  7: (ab, cb, dc, da) => [[dc, da]]
};
isolineLUT[8] = isolineLUT[7];
isolineLUT[9] = isolineLUT[6];
isolineLUT[10] = (ab, cb, dc, da) => [[dc, cb], [da, ab]]
isolineLUT[11] = isolineLUT[4];
isolineLUT[12] = isolineLUT[3];
isolineLUT[13] = isolineLUT[2];
isolineLUT[14] = isolineLUT[1];
isolineLUT[15] = isolineLUT[0];

/**
 * Converts a rectangular grid of values into an isoline at the specified
 * level.
 * 
 * Uses the [Marching Squares algorithm](https://en.wikipedia.org/wiki/Marching_squares)
 * 
 * @param {number[][]} grid Grid of data
 * @param {number} level 
 * @returns {Vector[][]}
 */
function gridToIsoline(grid, level) {
  const binaryGrid = [];
  const height =  grid.length;
  const width = grid[0].length;
  for (let y = 0; y < height; y++) {
    if (!grid[y]) {
      throw new TypeError(`gridToIsoline: grid is sparse, missing row ${y}`);
    }
    if (grid[y].length !== width) {
      throw new TypeError('gridToIsoline: grid is not rectangular')
    }

    binaryGrid[y] = [];
    for (let x = 0; x < width; x++) {
      if (typeof grid[y][x] !== 'number') {
        throw new TypeError(`gridToIsoline: grid is sparse, missing cell (${x}, ${y})`);
      }
      
      binaryGrid[y][x] = grid[y][x] >= level ? 1 : 0;
    }
  }

  const contour = [];
  for (let y = 1; y < height; y++) {
    for (let x = 1; x < width; x++) {
      let cellType = binaryGrid[y][x-1];
      cellType = (cellType << 1) | binaryGrid[y][x];
      cellType = (cellType << 1) | binaryGrid[y-1][x];
      cellType = (cellType << 1) | binaryGrid[y-1][x-1];
      
      // Resolve ambiguous saddle case
      if (cellType === 5 || cellType === 10) {
        const avg = (grid[y][x] + grid[y-1][x] + grid[y][x-1] + grid[y-1][x-1]) / 4;
        // xor 0b1111 flips the first 4 bits
        if (avg < level) cellType = cellType ^ 0b1111;
      }

      const a = V(x, y);
      const b = V(x, y - 1);
      const c = V(x - 1, y - 1);
      const d = V(x - 1, y);
      const va = grid[y][x];
      const vb = grid[y-1][x];
      const vc = grid[y-1][x-1];
      const vd = grid[y][x-1];

      const ab = Vector.Lerp(a, b, inverseLerp(va, vb, level));
      const cb = Vector.Lerp(c, b, inverseLerp(vc, vb, level));
      const dc = Vector.Lerp(d, c, inverseLerp(vd, vc, level));
      const da = Vector.Lerp(d, a, inverseLerp(vd, va, level));
      contour.push(...isolineLUT[cellType](ab, cb, dc, da));
    }
  }

  return { contour, binaryGrid };
}

export {
  gridToIsoline,
}
