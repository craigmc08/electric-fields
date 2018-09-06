import V from './Vector';
import Random from './Random';
import P from './PointCharge';
import { hsl, hslToRgb } from './util';
import Handle from './Handle';
import ColorField from './Renderer/ColorField';
import FieldLines from './Renderer/FieldLines';

const width = 1280;
const height = 720;
const HANDLE_SIZE = 15;
const HANDLE_SIZE_MULT = 3;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;

const points = [];
const handles = [];
const selection = new Proxy({ selected: -1 }, {
    get: (target, prop) => {
        if (prop === 'select') {
            return i => {
                target.selected = i;
                if (handles[i] !== undefined) handles[i].select();
            };
        } else if (prop === 'deselect') {
            return () => {
                target.selected = -1;
                handles.forEach(handle => handle.deselect());
            }
        } else {
            return target[prop];
        }
    },
});

const addPointButton = document.getElementById('add-point');
const removePointButton = document.getElementById('remove-point')

function createPointCharge(i, pointCharge=undefined) {
    let charge;
    let v;
    let p;
    if (pointCharge === undefined) {
        charge = Random.Sign(Random.RangeInt(1, 4));
        v = Random.Position(0, width, 0, height);
        p = new P(v, charge);
    } else {
        charge = pointCharge.charge;
        v = pointCharge.pos;
        p = pointCharge;
    }
    points.push(p);

    const handle = new Handle(charge > 0 ? '+' : '-',
        v.x, v.y,
        Math.abs(charge) * HANDLE_SIZE_MULT + HANDLE_SIZE,
        charge > 0 ? hsl(120, 100, 75) : hsl(0, 100, 75),
        width, height
    );
    const index = i;
    handle.on('move', ({ x, y }) => {
        points[i] = new P(new V(x, y), points[index].charge, points[index].v);
        drawStuff();
    });
    handle.on('click', () => {
        selection.select(i);
    });
    handle.on('declick', () => {
        selection.deselect(i);
    });
    handles.push(handle);
}

function setup() {
    // for (let i = 0; i < 4; i++) {
    //     createPointCharge(i);
    // }
    const x1 = width / 2 - width / 4;
    const x2 = width / 2 + width / 4;
    const y = height / 2;
    createPointCharge(0, new P(new V(x1, y), 3));
    createPointCharge(1, new P(new V(x2, y), 3));
    createPointCharge(2, new P(new V(width / 2, height / 2 ), -3));

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
    // ColorField(ctx, points);
    FieldLines(ctx, points);
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