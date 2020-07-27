import { clamp } from './util';
import Observable from './Observable';

let handles = [];

const handleHolder = document.getElementById('handles-holder');
window.addEventListener('mousemove', e => {
    handles.forEach(handle => handle.onMove.bind(handle)(e));
});
window.addEventListener('mouseup', e => {
    handles.forEach(handle => handle.onStop.bind(handle)(e));
});
handleHolder.addEventListener('click', e => {
    if (e.defaultPrevented) return;
    handles.forEach(handle => handle.dispatch('declick'));
});

class Handle extends Observable {
    constructor(x, y, settings, width, height) {
        super();

        this.handleHolder = document.getElementById('handles');

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.mx = 0;
        this.my = 0;
        this.moving = false;

        this.el = document.createElement('div');
        this.updateSettings(settings);
        this.renderPosition();

        this.el.addEventListener('mousedown', this.onStart.bind(this));
        this.el.addEventListener('click', this.onClick.bind(this));

        this.handleHolder.appendChild(this.el);

        handles.push(this);
    }

    updateSettings({ symbol, size, color }) {
        console.log(symbol, size, color);
        this.el.style.setProperty('--symbol', `'${symbol}'`);
        this.el.style.setProperty('--size', `${size}px`);
        this.el.style.backgroundColor = color;
        this.el.classList = 'handle';
    }

    onStart() {
        this.mx = this.x;
        this.my = this.y;
        this.moving = true;
        this.dispatch('click');
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

    onClick(e) {
        e.preventDefault();
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

    select() {
        this.el.setAttribute('data-selected', true);
    }
    deselect() {
        this.el.setAttribute('data-selected', false);
    }
}

export default Handle;
