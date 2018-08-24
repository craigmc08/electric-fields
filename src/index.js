import V from './Vector';
import Random from './Random';
import P from './PointCharge';
import { hsl, hslToRgb } from './util';
import Handle from './Handle';

const width = 1280;
const height = 720;
const HANDLE_SIZE = 15;
const HANDLE_SIZE_MULT = 3;

let FIELD_BLOCK_SIZE = 10;
const FIELD_DISPLAY_MULT = 0.015;
const FIELD_DISPLAY_POWER = 0.5;
const FIELD_MAG_TIERS = 100;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;

const points = [];
const handles = [];
// const selectedPoint = -1;

const resolutionInput = document.getElementById('resolution');
const addPointButton = document.getElementById('add-point');
const removePointButton = document.getElementById('remove-point');

function createPointCharge(i) {
    const charge = Random.Range(1, 3) * (i % 2 == 0 ? 1 : -1);
    const v = Random.Position(0, width, 0, height);
    const p = P(v, charge);
    points.push(p);

    const handle = new Handle(charge > 0 ? '+' : '-',
        v.x, v.y,
        Math.abs(charge) * HANDLE_SIZE_MULT + HANDLE_SIZE,
        charge > 0 ? hsl(120, 100, 75) : hsl(0, 100, 75),
        width, height
    );
    const index = i;
    handle.on('move', ({ rapid, x, y }) => {
        points[i] = P(V(x, y), points[index].charge, points[index].v);
        drawStuff();
    });
    handles.push(handle);
}

function setup() {
    for (let i = 0; i < 4; i++) {
        createPointCharge(i);
    }

    resolutionInput.addEventListener('change', () => {
        const value = resolutionInput.value;
        const res = parseInt(value);
        FIELD_BLOCK_SIZE = res;
        drawStuff();
    });
    addPointButton.addEventListener('click', () => {
        createPointCharge(points.length);
        drawStuff();
    });
    removePointButton.addEventListener('click', () => {
        const i = points.length - 1;
        if (i < 0) return;
        points.pop();
        const handle = handles[i];
        handle.Destroy();
        handles.pop();
        drawStuff();
    });

    drawStuff();
}

function draw() {

}

function drawStuff() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    let i = 0;
    const pixels = new Uint8ClampedArray(width * height * 4)
    for (let y = 0; y < height; y += FIELD_BLOCK_SIZE) {
        for (let x = 0; x < width ; x += FIELD_BLOCK_SIZE) {
            let field = V(0, 0);
            const pos = V(x, y);
            points.forEach(point => {
                field = V.Add(field, P.Field(pos, point));
            });
            const a = V.Angle(field);
            const a_pos = a < 0 ? Math.PI * 2 + a : a;
            const a_8bit = Math.floor(a_pos / Math.PI * 180);
            const hue = (a_8bit + 180) % 360;

            const mag = V.Mag(field);
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

let lastFrameTime = Date.now();
function loop() {
    const dt = (Date.now() - lastFrameTime) / 1000;
    lastFrameTime = Date.now();
    draw(dt);
    requestAnimationFrame(loop);
}

window.onload = () => {
    setTimeout(() => {
        setup();
        loop();
    }, 1);
};