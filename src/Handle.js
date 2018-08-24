import { clamp } from './util';
import Observable from './Observable';

let handles = [];

window.addEventListener('mousemove', e => {
    e.preventDefault();
    handles.forEach(handle => handle.onMove.bind(handle)(e));
});
window.addEventListener('mouseup', e => {
    e.preventDefault();
    handles.forEach(handle => handle.onStop.bind(handle)(e));
});

class Handle extends Observable {
    constructor(symbol, x, y, size, color, width, height) {
        super();

        this.handleHolder = document.getElementById('handles');

        this.symbol = symbol;

        this.x = x;
        this.y = y;
        this.size;

        this.width = width;
        this.height = height;

        this.mx = 0;
        this.my = 0;
        this.moving = false;

        this.el = document.createElement('div');
        this.el.style.setProperty('--symbol', `'${symbol}'`);
        this.el.style.setProperty('--size', `${size}px`);
        this.el.style.backgroundColor = color;
        this.el.classList = 'handle';
        this.renderPosition();

        this.el.addEventListener('mousedown', this.onStart.bind(this));

        this.handleHolder.appendChild(this.el);

        handles.push(this);
    }

    onStart() {
        this.mx = this.x;
        this.my = this.y;
        this.moving = true;
    }

    onMove(e) {
        if(!this.moving) return;
        
        const [x, y] = this.screenToCanvas(e.pageX, e.pageY);
        this.mx = x;
        this.my = y;
        // console.log(this.mx, this.my);
        this.updatePosition();
    }

    onStop() {
        this.moving = false;
        this.dispatch('move', { rapid: false, x: this.x, y: this.y });
    }

    screenToCanvas(sx, sy) {
        const x = sx - this.handleHolder.offsetLeft;
        const y = sy - this.handleHolder.offsetTop;
        return [x, y];
    }

    updatePosition() {
        const x = clamp(0, this.width)(this.mx);
        const y = clamp(0, this.height)(this.my);
        const changed = x != this.x || y != this.y;

        this.x = x;
        this.y = y;

        if (changed) this.renderPosition();
    }
    renderPosition() {
        // console.log(this.x, this.y);
        this.el.style.setProperty('--x', `${this.x}px`);
        this.el.style.setProperty('--y', `${this.y}px`);
        this.dispatch('move', { rapid: true, x: this.x, y: this.y });
    }

    Destroy() {
        this.el.remove();
        const i = handles.findIndex(handle => handle == this);
        if (i == -1) return;
        if (i == handles.length) handles.pop();
        handles = [...handles.slice(0, i), ...handles.slice(i + 1)];
    }
}

export default Handle;