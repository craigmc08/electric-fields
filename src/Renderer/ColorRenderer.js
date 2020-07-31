import { hslToRgb } from '../util'
import V from '../Vector';
import { potentialAt, fieldAt } from '../math/util';

/**
 * @param {import('dat.gui').GUI} gui 
 */
function setupGui(gui, onChange, settings) {
  gui.add(settings, 'blockSize').min(1).step(1).onChange(onChange);
  gui.add(settings, 'displayMultiplier').min(0.0001).max(0.02).step(0.0001).onChange(onChange);
  gui.add(settings, 'displayPower').step(0.01).onChange(onChange);
  gui.add(settings, 'levels').min(1).max(256).step(1).onChange(onChange);
}

/**
 * 
 * @param {*} colorPicker 
 * @param {*} defaultSettings 
 * @param {'field' | 'potential' | 'position'} mode 
 */
function ColorRenderer(colorPicker, defaultSettings={}, mode='field') {
  const settings = Object.assign({
    blockSize: 10,
    displayMultiplier: 0.015,
    displayPower: 0.5,
    levels: 100
  }, defaultSettings);

  return {
    settings,
    setupGui: (gui, onChange) => setupGui(gui, onChange, settings),
    render: (cg, points) => {
      const ctx = cg.ctx;
      const { width, height } = ctx.canvas;

      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, width, height);

      let i = 0;
      const pixels = new Uint8ClampedArray(width * height * 4)
      for (let y = 0; y < height; y += settings.blockSize) {
        for (let x = 0; x < width ; x += settings.blockSize) {
          const pos = new V(x + settings.blockSize / 2, y + settings.blockSize / 2);

          let rgb = [0, 0, 0];
          if (mode === 'potential') {
            const pot = potentialAt(points, pos);
            rgb = colorPicker(pot, settings);
          } else if (mode === 'field') {
            const field = fieldAt(points, pos);
            rgb = colorPicker(field, settings);
          } else if (mode === 'position') {
            rgb = colorPicker(undefined, settings, pos, points);
          }

          const [r, g, b] = rgb;

          for (let j = 0; j < settings.blockSize; j++) {
            for (let k = 0; k < settings.blockSize; k++) {
              const l = 4 * (j * width + k);
              pixels[i + l] = r;
              pixels[i + l + 1] = g;
              pixels[i + l + 2] = b;
              pixels[i + l + 3] = 255;
              }
          }

          i += settings.blockSize * 4;
        }
        i += settings.blockSize * width * 4 - 4 * width;
      }
      const imageData = new ImageData(pixels, width, height);
      ctx.putImageData(imageData, 0, 0);
    }
  };
}

export {
  ColorRenderer
};
