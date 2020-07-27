import V from './Vector';
import P from './PointCharge';
import { hsl } from './util';
import Handle from './Handle';
import ColorField from './Renderer/ColorField';
import FieldLines from './Renderer/FieldLines';
import VectorField from './Renderer/VectorField';
import PotentialField from './Renderer/PotentialField';
import debounce from './debounce';
import * as dat from 'dat.gui';
import CanvasGraph from './canvas-graph';
import PointCharge from './PointCharge';
import Vector from './Vector';

const styles = {
    colors: 'colors',
    lines: 'lines',
    vectors: 'vectors',
    potential: 'potential',
};

const cg = new CanvasGraph(document.getElementById('graph-holder'), {
    fullsize: true,
});

const canvas = cg.canvas;

const width = canvas.width;
const height = canvas.height;
const HANDLE_SIZE = 15;
const HANDLE_SIZE_MULT = 3;

const points = [];
const handles = [];

const ef = new ElectricFields();

function handleSettingsFromCharge(charge) {
    return {
        symbol: charge > 0 ? '+' : '-',
        size: Math.abs(charge) * HANDLE_SIZE_MULT + HANDLE_SIZE,
        color: charge > 0 ? hsl(120, 100, 70) : hsl(0, 100, 70)
    };
}

function createPointCharge(pointCharge) {
    const charge = pointCharge.charge;
    const v = pointCharge.pos;
    const p = pointCharge;
    points.push(p);

    const handle = new Handle(v.x, v.y, handleSettingsFromCharge(charge), width, height);
    const index = points.length - 1;
    handle.on('move', debounce(50, ({ x, y }) => {
        points[index] = new P(new V(x, y), points[index].charge, points[index].v);
        drawStuff();
    }));
    handle.on('click', () => {
        ef.select(index);
    });
    handle.on('declick', () => {
        ef.deselect(index);
    });
    handles.push(handle);
}

function drawStuff() {
    const drawType = ef.style;
    if (drawType == styles.colors) {
        ColorField(cg, points);
    } else if (drawType == styles.lines) {
        FieldLines(cg, points);
    } else if (drawType == styles.vectors) {
        VectorField(cg, points);
    } else if (drawType == styles.potential) {
        PotentialField(cg, points);
    }
}

function SelectedCharge() {
    this.charge = 1;
    this.x = 0;
    this.y = 0;
}

function ElectricFields() {
    this.style = styles.colors;
    this.charge = 1;

    this.selectedCharge = new SelectedCharge();
    this.selectedChargeIndex = -1;

    this.selectedSettingsFolder = undefined;

    this.createCharge = function createCharge() {
        createPointCharge(new PointCharge(new Vector(width / 2, height / 2), this.charge));
        this.select(points.length - 1);
        drawStuff();
    };
    this.removeCharge = function removeCharge() {
        if (this.selectedChargeIndex < 0) return;
        if (this.selectedChargeIndex >= points.length) return;

        points.splice(this.selectedChargeIndex, 1);
        handles[this.selectedChargeIndex].Destroy();
        handles.splice(this.selectedChargeIndex, 1);
        drawStuff();
    }

    this.select = function select(i) {
        if (!handles[i] || !points[i]) return;

        handles[i].select();
        this.selectedChargeIndex = i;
        this.selectedCharge.charge = points[i].charge;
        this.selectedCharge.x = points[i].pos.x;
        this.selectedCharge.y = points[i].pos.y;
        if (this.selectedSettingsFolder) this.selectedSettingsFolder.show();
    }
    this.deselect = function deselect(i) {
        if (handles[i]) {
            handles[i].deselect();
        }

        this.selectedChargeIndex = -1;
        if (this.selectedSettingsFolder) this.selectedSettingsFolder.hide();
    }
}

window.onload = () => {
    const selectedCharge = new SelectedCharge();
    ef.selectedCharge = selectedCharge;
    const gui = new dat.GUI();

    gui.add(ef, 'style', Object.keys(styles)).onFinishChange(() => {
        drawStuff();
    });
    gui.add(ef, 'charge', -10, 10);
    gui.add(ef, 'createCharge');
    gui.width = 400;
    
    const selectedSettings = gui.addFolder('Selected Charge');
    selectedSettings.add(ef.selectedCharge, 'charge', -10, 10).listen().onChange(debounce(50, (v) => {
        if (ef.selectedChargeIndex === -1) return;

        points[ef.selectedChargeIndex].charge = v;
        handles[ef.selectedChargeIndex].updateSettings(handleSettingsFromCharge(v));
        drawStuff();
    }));
    selectedSettings.add(ef.selectedCharge, 'x').listen().onChange(debounce(50, x => {
        if (ef.selectedChargeIndex === -1) return;

        points[ef.selectedChargeIndex].pos.x = x;
        handles[ef.selectedChargeIndex].x = x;
        handles[ef.selectedChargeIndex].renderPosition();
        drawStuff();
    }));
    selectedSettings.add(ef.selectedCharge, 'y').listen().onChange(debounce(50, y => {
        if (ef.selectedChargeIndex === -1) return;

        points[ef.selectedChargeIndex].pos.y = y;
        handles[ef.selectedChargeIndex].y = y;
        handles[ef.selectedChargeIndex].renderPosition();
        drawStuff();
    }));
    selectedSettings.add(ef, 'removeCharge');
    selectedSettings.open();
    selectedSettings.hide();
    ef.selectedSettingsFolder = selectedSettings;

    const x1 = width / 2 - width / 4;
    const x2 = width / 2 + width / 4;
    const y = height / 2;
    createPointCharge(new P(new V(x1, y), 3));
    createPointCharge(new P(new V(x2, y), -3));

    drawStuff();
};
