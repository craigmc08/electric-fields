import { hsl, hslToRgb } from '../util'
import V from '../Vector';

let FIELD_BLOCK_SIZE = 10;
const FIELD_DISPLAY_MULT = 0.015;
const FIELD_DISPLAY_POWER = 0.5;
const FIELD_MAG_TIERS = 100;

export default function Render(ctx, points) {
    const { width, height } = ctx.canvas;

    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    let i = 0;
    const pixels = new Uint8ClampedArray(width * height * 4)
    for (let y = 0; y < height; y += FIELD_BLOCK_SIZE) {
        for (let x = 0; x < width ; x += FIELD_BLOCK_SIZE) {
            let field = new V(0, 0);
            const pos = new V(x, y);

            points.forEach(point => {
                field = field.add(point.field(pos));
            });

            const a = field.angle() + Math.PI;
            const a_pos = a < 0 ? Math.PI * 2 + a : a;
            const a_8bit = Math.floor(a_pos / Math.PI * 180);
            const hue = (a_8bit + 180) % 360;

            const mag = field.mag();
            let v =  Math.pow(mag, FIELD_DISPLAY_POWER) * FIELD_DISPLAY_MULT;
            v = Math.floor(v / (100 / FIELD_MAG_TIERS)) * (100 / FIELD_MAG_TIERS);
            const [r, g, b] = hslToRgb(hue / 360, 100 / 100, v / 100);

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