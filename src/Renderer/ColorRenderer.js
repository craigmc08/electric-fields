import { hslToRgb } from '../util'
import V from '../Vector';

let FIELD_BLOCK_SIZE = 10;
const FIELD_DISPLAY_MULT = 0.015;
const FIELD_DISPLAY_POWER = 0.5;
const FIELD_MAG_TIERS = 100;

export default function ColorRenderer(colorPicker, usePotential=false) {
  return (cg, points) => {
    const ctx = cg.ctx;
    const { width, height } = ctx.canvas;

    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    let i = 0;
    const pixels = new Uint8ClampedArray(width * height * 4)
    for (let y = 0; y < height; y += FIELD_BLOCK_SIZE) {
      for (let x = 0; x < width ; x += FIELD_BLOCK_SIZE) {
        const pos = new V(x, y);

        let rgb = [0, 0, 0];
        if (usePotential) {
          const pot = points
            .map(p => p.potential(pos))
            .reduce((a, c) => a + c, 0)
          ;
          rgb = colorPicker(pot);
        } else {
          const field = points
            .map(p => p.field(pos))
            .reduce((a, c) => a.add(c), new V(0, 0))
          ;
          rgb = colorPicker(field);
        }

        const [r, g, b] = rgb;

        for (let j = 0; j < FIELD_BLOCK_SIZE; j++) {
          for (let k = 0; k < FIELD_BLOCK_SIZE; k++) {
            const l = 4 * (j * width + k);
            pixels[i + l] = r;
            pixels[i + l + 1] = g;
            pixels[i + l + 2] = b;
            pixels[i + l + 3] = 255;
            }
        }

        i += FIELD_BLOCK_SIZE * 4;
      }
      i += FIELD_BLOCK_SIZE * width * 4 - 4 * width;
    }
    const imageData = new ImageData(pixels, width, height);
    ctx.putImageData(imageData, 0, 0);
  }
}
