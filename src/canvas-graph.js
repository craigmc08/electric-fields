const CanvasGraph = (function(module) { // eslint-disable-line
    /**
    * Graph class
    */
    class Graph {
        /**
         * @constructor
         * @param {Element} container - Container element of canvas graph
         * @param {GraphOptions} options - Options to use for the graph
         */
        constructor(container, options) {
            const defaultOptions = {
                fullsize: false,
                autosize: true,
                width: undefined,
                height: undefined,
                defaultZoom: 5,
                defaultCenter: [0, 0],
            };

            this.container = container;

            this.options = Object.assign({}, defaultOptions, options);

            this.center = this.options.defaultCenter.slice();
            this.radX = this.options.defaultZoom;

            this.aspect = undefined;

            this.fullsize = this.options.fullsize;
            this.autosize = this.options.autosize && !this.fullsize;
            this.width = this.options.width;
            this.height = this.options.height;

            this.canvas = document.createElement('canvas');
            this.canvas.classList.add("graph");
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');

            // Color settings
            this._bgColor = 'white';
            this._majorLineColor = 'rgb(150, 150, 150)';
            this._minorLineColor = 'rgb(170, 170, 170)';
            this._axisColor = 'black';
            // End color settings

            this.dragging = false;

            // Things to draw
            this._drawGrid = false;
            /** @property {GraphDrawer[][]} layers */
            this.layers = [];

            this.initEventHandlers();
            this.resize();

            // Bind functions
            this.gtc = this.gtc.bind(this);
            this.sgtc = this.sgtc.bind(this);
            this.ctg = this.ctg.bind(this);
            this.sctg = this.sctg.bind(this);

            this.drawGraph();
        }

        /**
         * Draws the entire graph
         */
        drawGraph() {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(0, 0, this.width, this.height);

            if (this.drawGrid) this.drawLines();
            const graphInfo = {
                ctx: this.ctx,
                gtc: this.gtc,
                sgtc: this.sgtc,
                ctg: this.ctg,
                sctg: this.sctg,
                width: this.width,
                height: this.height,
            };
            this.layers.forEach(layer => layer.forEach(obj => obj.draw(graphInfo)));
        }

        /**
         * @private
         * Draws the grid lines on the canvas
         */
        drawLines() {
            const { ctx, center, radX, radY, gtc } = this;
            const gridScale = 1;

            ctx.strokeStyle = this.majorLineColor;
            ctx.lineWidth = 1;
            const gridStartX = Math.floor((center[0] - radX) / gridScale) * gridScale;
            const gridEndX = center[0] + radX;
            for (let x = gridStartX; x <= gridEndX; x += gridScale) {
                ctx.beginPath();
                ctx.moveTo(...gtc(x, center[1] + radY));
                ctx.lineTo(...gtc(x, center[1] - radY));
                ctx.stroke();
            }
            const gridStartY = Math.floor((center[1] - radY) / gridScale) * gridScale;
            const gridEndY = center[1] + radY;
            for (let y = gridStartY; y <= gridEndY; y += gridScale) {
                ctx.beginPath();
                ctx.moveTo(...gtc(center[0] - radX, y));
                ctx.lineTo(...gtc(center[0] + radX, y));
                ctx.stroke();
            }

            ctx.strokeStyle = this.axisColor;
            ctx.lineWidth = 2;
            if (0 >= center[0] - radX && 0 <= center[0] + radX) {
                ctx.beginPath();
                ctx.moveTo(...gtc(0, center[1] + radY));
                ctx.lineTo(...gtc(0, center[1] - radY));
                ctx.stroke();
            }
            if (0 >= center[1] - radY && 0 <= center[1] + radY) {
                ctx.beginPath();
                ctx.moveTo(...gtc(center[0] - radX, 0));
                ctx.lineTo(...gtc(center[0] + radX, 0));
                ctx.stroke();
            }
        }

        dragStart() {
            this.dragging = true;
        }
        /**
         * @param {MouseEvent} e 
         */
        dragMove(e) {
            if (!this.dragging) return;

            const dx = e.movementX;
            const dy = e.movementY;
            const gdx = -this.sctg(dx);
            const gdy = this.sctg(dy);
            this.center[0] += gdx;
            this.center[1] += gdy;

            this.drawGraph();
        }
        dragEnd() {
            this.dragging = false;
        }

        /**
         * @param {WheelEvent} e 
         */
        onScroll(e) {
            const { radX, radY, width, height, center } = this;

            // Calculate new radii
            const newRadX = radX * Math.pow(1.05, Math.sign(e.deltaY));
            const newRadY = newRadX / this.aspect;

            // Calculate new position for the center of the graph
            // to keep the mouse over the same graph unit
            const smx = e.clientX;
            const smy = e.clientY;
            const rect = this.canvas.getBoundingClientRect();
            const mx = smx - rect.left;
            const my = smy - rect.top;
            
            const newCenterX = (mx / width * 2) * (radX - newRadX) + center[0] + newRadX - radX;
            const newCenterY = (2 - my / height * 2) * (radY - newRadY) + center[1] + newRadY - radY;

            this.center[0] = newCenterX;
            this.center[1] = newCenterY;
            this.radX = newRadX;

            // Redraw the graph
            this.drawGraph();
        }

        /**
         * @private
         * Initialize event handlers
         */
        initEventHandlers() {
            if (this.autosize) {
                this.container.addEventListener('resize', this.resize.bind(this));
            } else if (this.fullsize) {
                window.addEventListener('resize', this.resize.bind(this));
            }

            // TODO: Split up touch and mouse events to be able to handle pinch to zoom on mobile
            this.canvas.addEventListener('mousedown', this.dragStart.bind(this));
            this.canvas.addEventListener('touchstart', this.dragStart.bind(this));

            window.addEventListener('mousemove', this.dragMove.bind(this));
            window.addEventListener('touchmove', this.dragMove.bind(this));

            window.addEventListener('mouseup', this.dragEnd.bind(this));
            window.addEventListener('touchend', this.dragEnd.bind(this));

            this.canvas.addEventListener('mousewheel', this.onScroll.bind(this));
        }

        /**
         * @private
         * Updates canvas size
        */
        resize() {
            if (this.fullsize) {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            } else if (this.autosize) {
                const rect = this.container.getBoundingClientRect();
                this.width = rect.width;
                this.height = rect.height;
            }

            this.aspect = this.width / this.height;
            this.setCanvasSize();
        }
        /**
         * @private
         * Updates canvas size to match settings
         */
        setCanvasSize() {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            if (this.fullsize) {
                this.canvas.style.position = 'absolute';
                this.canvas.style.top = '0';
                this.canvas.style.bottom = '0';
            }
        }

        /**
         * Transforms a graph point to a Canvas point
         * @param {number} x - X coordinate of graph point
         * @param {number} y - Y coordinate of graph point
         * @returns {number[]} Canvas coordinate [x, y]
         */
        gtc(x, y) {
            const { center, radX, radY, width, height } = this;
            const cx = (x - center[0] + radX) / radX / 2 * width;
            const cy = (1 - (y - center[1] + radY) / radY / 2) * height;
            return [ cx, cy ];
        }
        /**
         * Scales a graph scalar to a canvas scalar
         * @param {number} n - Scalar in graph size
         * @returns {number} Scalar in canvas (screen) size
         */
        sgtc(n) {
            return n / this.radX / 2 * this.width;
        }
        /**
         * Transforms a canvas point to a graph point
         * @param {number} x - X coordinate of canvas (screen) point
         * @param {number} y - Y coordinate of canvas (screen) point
         * @returns {number[]} Graph coordinate [x, y]
         */
        ctg(x, y) {
            const { center, radX, radY, width, height } = this;
            const gx = x / width * radX * 2 + center[0] - radX;
            const gy = (1 - y / height) * radY * 2 + center[1] - radY;
            return [ gx, gy ];
        }
        /**
         * Scales a canvas scalar to a graph scalar
         * @param {number} n - Scalar in canvas (screen) size
         * @returns {number} Scalar in graph size
         */
        sctg(n) {
            return n / this.width * this.radX * 2;
        }

        /**
         * Adds a new object to graph
         * @param {GraphDrawer} object - Object to add
         * @param {number} layer - Which z-depth to put it at (higher = more on top) (whole number)
         */
        Add(object, layer) {
            object.onDirty(this.drawGraph.bind(this));
            if (this.layers[layer] === undefined) this.layers[layer] = [];
            this.layers[layer].push(object);
            this.drawGraph();
        }
        /**
         * Removes an object from the graph
         * @param {GraphDrawer} object - Object to remove, must be a reference to same memory location
         * @param {?number} layer - Layer to remove from, if not set, it will be found automatically
         */
        Remove(object, layer=-1) {
            if (layer === -1) {
                const i = this.layers.reduce((i, lay, ci) => (
                    i !== undefined ? i : lay.some(obj => obj.id === object.id) ? ci : i
                ), undefined);
                this.layers[i].filter(obj => obj != object);
            } else {
                this.layers[layer].filter(obj => obj.id !== object.id);
            }
            this.drawGraph();
        }
        /**
         * Clears all things that are being drawn 
         * @param {?...number} layers - Layers to remove, if not specified, removes layers
         */
        Clear(...layers) {
            if (layers.length >= 1) {
                layers.forEach(i => this.layers[i] = []);
            } else {
                this.layers = [];
            }
            this.drawGraph();
        }

        /**
         * @property {number} radY The y area of the graph screen
         */
        get radY() { return this.radX / this.aspect; }
        /**
         * @property {boolean} drawGrid Whether the background grid should be drawn
         */
        get drawGrid() { return this._drawGrid; }
        set drawGrid(value) {
            this._drawGrid = value;
            this.drawGraph();
        }

        /** @property {string} bgColor - Color of background */
        get bgColor() { return this._bgColor; }
        set bgColor(val) { this._bgColor = val; this.drawGraph(); }

        /** @property {string} majorLineColor - Color of major grid lines */
        get majorLineColor() { return this._majorLineColor; }
        set majorLineColor(val) { this._majorLineColor = val; this.drawGraph(); }

        /** @property {string} minorLineColor - Color of minor grid lines */
        get minorLineColor() { return this._minorLineColor; }
        set minorLineColor(val) { this._minorLineColor = val; this.drawGraph(); }

        /** @property {string} axisColor - Color of axis lines */
        get axisColor() { return this._axisColor; }
        set axisColor(val) { this._axisColor = val; this.drawGraph(); }
    }

    class StrokeStyle {
        constructor(color='rgba(0, 0, 0, 0)', width='2') {
            this.color = color;
            this.width = width;
        }
        /**
         * Activates the stroke style for the graph
         * @param {GraphContext} context 
         */
        set(context) {
            const { ctx } = context;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
        }
    }
    class FillStyle {
        constructor(color='rgba(0, 0, 0, 0)') {
            this.color = color;
        }
        /**
         * Activates the fill style for the graph
         * @param {GraphContext} context 
         */
        set(context) {
            const { ctx } = context;
            ctx.fillStyle = this.color;
        }
    }

    /**
     * @typedef {object} GraphContext
     * @property {CanvasRenderingContext2D} ctx
     * @property {function} gtc - Transforms graph coordinates to screen coordinates
     * @property {function} sgtc - Scales number from graph size to screen size
     * @property {function} ctg - Transforms screen coordinates to graph coordinates
     * @property {function} sctg - Scales number from screen size to graph size
     * @property {number} width - Width of canvas in pixels
     * @property {number} height - Height of canvas in pixels
     */

    let graphDrawerIdCounter = 0;
    /** Base class for drawing things on the screen */
    class GraphDrawer {
        constructor() {
            this.onDirties = [];
            /** @property {number} id - The unique id of this graph drawer */
            this.id = ++graphDrawerIdCounter;
        }
        /**
         * @param {GraphContext} context 
         */
        draw() {}

        /**
         * Adds a listener to the drawers `onDirty` event
         * @param {function} cb 
         */
        onDirty(cb) {
            this.onDirties.push(cb);
        }
        /**
         * Triggers the `onDirty` listeners
         */
        setDirty() {
            this.onDirties.forEach(cb => cb());
        }
    }
    /** Class to straight point-to-point lines on the graph */
    class GraphLine extends GraphDrawer {
        /**
         * Create a Graph Line
         * @param {number} sx - Point 1 x
         * @param {number} sy - Point 1 y
         * @param {number} ex - Point 2 x
         * @param {number} ey - Point 2 y
         * @param {StrokeStyle} stroke 
         */
        constructor(sx, sy, ex, ey, stroke=new StrokeStyle()) {
            super();
            this._sx = sx;
            this._sy = sy;
            this._ex = ex;
            this._ey = ey;
            this.stroke = stroke;
        }

        /**
         * @param {GraphContext} context
         */
        draw(context) {
            const { ctx, gtc } = context;
            const [ csx, csy ] = gtc(this.sx, this.sy);
            const [ cex, cey ] = gtc(this.ex, this.ey);
            this.stroke.set(context);
            ctx.beginPath();
            ctx.moveTo(csx, csy);
            ctx.lineTo(cex, cey);
            ctx.stroke();
        }

        get sx() { return this._sx; } set sx(val) { this._sx = val; this.setDirty(); }
        get sy() { return this._sy; } set sy(val) { this._sy = val; this.setDirty(); }
        get ex() { return this._ex; } set ex(val) { this._ex = val; this.setDirty(); }
        get ey() { return this._ey; } set ey(val) { this._ey = val; this.setDirty(); }
    }
    /** Class to draw circles on the graph */
    class GraphCircle extends GraphDrawer {
        /**
         * Create a Graph Circle
         * @param {number} cx - Center of circle x
         * @param {number} cy - Center of circle y
         * @param {number} r - Radius of circle
         * @param {StrokeStyle} stroke 
         * @param {FillStyle} fill 
         */
        constructor(cx, cy, r, stroke=new StrokeStyle(), fill=new FillStyle()) {
            super();
            this._cx = cx;
            this._cy = cy;
            this._r = r;
            this.stroke = stroke;
            this.fill = fill;
        }

        /**
         * @param {GraphContext} context
         */
        draw(context) {
            const { ctx, gtc, sgtc } = context;
            const [ ccx, ccy ] = gtc(this.cx, this.cy);
            const cr = sgtc(this.r);
            this.stroke.set(context);
            this.fill.set(context);
            ctx.beginPath();
            ctx.ellipse(ccx, ccy, cr, cr, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }

        get cx() { return this._cx; } set cx(val) { this._cx = val; this.setDirty(); }
        get cy() { return this._cy; } set cy(val) { this._cy = val; this.setDirty(); }
        get r() { return this._r; } set r(val) { this._r = val; this.setDirty(); }
    }
    /** Class to draw point (fixed screen size circles) on graph */
    class GraphPoint extends GraphDrawer {
        /**
         * Create a Graph Point
         * @param {number} cx - x coordinate (graph space)
         * @param {number} cy - y coordainte (graph space)
         * @param {number} r - radius (screen size)
         * @param {StrokeStyle} stroke 
         * @param {FillStyle} fill 
         */
        constructor(cx, cy, r, stroke=new StrokeStyle(), fill=new FillStyle()) {
            super();
            this._cx = cx;
            this._cy = cy;
            this._r = r;
            this.stroke = stroke;
            this.fill = fill;
        }

        /**
         * @param {GraphContext} context 
         */
        draw(context) {
            const { ctx, gtc } = context;
            const [ x, y ] = gtc(this.cx, this.cy);
            this.stroke.set(context);
            this.fill.set(context);
            ctx.beginPath();
            ctx.ellipse(x, y, this.r, this.r, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }

        get cx() { return this._cx; } set cx(val) { this._cx = val; this.setDirty(); }
        get cy() { return this._cy; } set cy(val) { this._cy = val; this.setDirty(); }
        get r() { return this._r; } set r(val) { this._r = val; this.setDirty(); }
    }
    /** Class to draw rectangles on the graph */
    class GraphRect extends GraphDrawer {
        /**
         * Create a Graph Rectangle
         * @param {number} x - x of bottom left corner
         * @param {number} y - y of bottom left corner
         * @param {number} w - width of rectangle
         * @param {number} h - height of rectangle
         * @param {StrokeStyle} stroke 
         * @param {FillStyle} fill 
         */
        constructor(x, y, w, h, stroke=new StrokeStyle(), fill=new FillStyle()) {
            super();
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;
            this.stroke = stroke;
            this.fill = fill;
        }
        /**
         * @param {GraphContext} context
         */
        draw(context) {
            const { ctx, gtc, sgtc } = context;
            this.stroke.set(context);
            this.fill.set(context);
            const [ cx, cy ] = gtc(this.x, this.y);
            const cw = sgtc(this.w);
            const ch = sgtc(this.h);
            ctx.fillRect(cx, cy, cw, ch);
            ctx.strokeRect(cx, cy, cw, ch);
        }

        get x() { return this._x; } set x(val) { this._x = val; this.setDirty(); }
        get y() { return this._y; } set y(val) { this._y = val; this.setDirty(); }
        get w() { return this._w; } set w(val) { this._w = val; this.setDirty(); }
        get h() { return this._h; } set h(val) { this._h = val; this.setDirty(); }
    }
    /** Class to draw simple y(x) functions on the graph */
    class GraphFunc extends GraphDrawer {
        /**
         * Create a Graph Function
         * @param {function} func - Single variable function to evaluate for each x
         * @param {StrokeStyle} stroke 
         */
        constructor(func, stroke=new StrokeStyle()) {
            super();
            this._func = func;
            this.stroke = stroke;
        }

        /**
         * @param {GraphContext} context
         */
        draw(context) {
            const { ctx, gtc, ctg, width } = context;
            this.stroke.set(context);

            let moveTo = true;
            ctx.beginPath();
            for (let sx = -4; sx < width + 4; sx++) {
                const [ x ] = ctg(sx, 0);
                if (moveTo) {
                    moveTo = false;
                    ctx.moveTo(...gtc(x, this.func(x)));
                } else {
                    ctx.lineTo(...gtc(x, this.func(x)));
                }
            }
            ctx.stroke();
        }

        get func() { return this._func; } set func(val) { this._func = val; this.setDirty(); }
    }
    /** Class to draw text to the screen */
    class GraphText extends GraphDrawer {
        /**
         * Create a GraphText
         * @param {string} text - Text to draw
         * @param {number} x - Center x graph coordinate of text
         * @param {*} y - Center y graph coordinate of text
         * @param {*} height - Height in graph scale of text
         * @param {*} stroke
         * @param {*} fill 
         */
        constructor(text, x, y, height, stroke=new StrokeStyle(), fill=new FillStyle()) {
            super();
            this._text = text;
            this._x = x;
            this._y = y;
            this._height = height;
            this.stroke = stroke;
            this.fill = fill;
        }
        /**
         * @param {GraphContext} context
         */
        draw(context) {
            const { ctx, sgtc, gtc } = context;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${Math.floor(2 * sgtc(this.height))}px sans-serif`;
            this.stroke.set(context);
            this.fill.set(context);
            ctx.fillText(this.text, ...gtc(this.x, this.y));
        }

        get text() { return this._text; } set text(val) { this._text = val; this.setDirty(); }
        get x() { return this._x; } set x(val) { this._x = val; this.setDirty(); }
        get y() { return this._y; } set y(val) { this._y = val; this.setDirty(); }
        get height() { return this._height; } set height(val) { this._height = val; this.setDirty(); }
    }
    /** Class to wrap ctx for custom drawing in graph */
    class GraphWrapper extends GraphDrawer {
        /**
         * Creates a graph wrapper, which calls the passed function with a
         * ctx that automatically scales from graph to screen
         * @param {function} drawer - Function to call with the wrapped ctx
         */
        constructor(drawer) {
            super();
            this.drawer = drawer;
        }
    
        /**
         * @param {GraphContext} context 
         */
        draw(context) {
            const { ctx, gtc, sgtc } = context;
            const affected = [
                'arc',
                'arcTo',
                'bezierCurveTo',
                'clearRect',
                'drawImage',
                'ellipse',
                'fillRect',
                'fillText',
                'lineTo',
                'moveTo',
                'quadraticCurveTo',
                'rect',
                'strokeRect',
                'strokeText',
            ];
            const wrappedCtx = new Proxy(ctx, {
                get: (target, prop) => {
                    if (prop === 'arc') {
                        return (x, y, radius, startAngle, endAngle, anticlockwise=false) => {
                            ctx.arc(...gtc(x, y), sgtc(radius), startAngle, endAngle, anticlockwise);
                        };
                    } else if (prop === 'arcTo') {
                        return (x1, y1, x2, y2, radius) => {
                            ctx.arcTo(...gtc(x1, y1), ...gtc(x2, y2), sgtc(radius));
                        };
                    } else if (prop === 'bezierCurveTo') {
                        return (cp1x, cp1y, cp2x, cp2y, x, y) => {
                            ctx.bezierCurveTo(...gtc(cp1x, cp1y), ...gtc(cp2x, cp2y), ...gtc(x, y));
                        };
                    } else if (prop === 'clearRect') {
                        return (x, y, w, h) => {
                            ctx.clearRect(...gtc(x, y), sgtc(w), -sgtc(h));
                        };
                    } else if (prop === 'drawImage') {
                        return (image, dx, dy, dw, dh, sx, sy, sw, sh) => {
                            ctx.drawImage(image, ...gtc(dx, dy), sgtc(dw), -sgtc(dh), ...gtc(sx, sy), sgtc(sw), -sgtc(sh));
                        };
                    } else if (prop === 'ellipse') {
                        return (x, y, rx, ry, rot, startAngle, endAngle, anticlockwise=false) => {
                            ctx.ellipse(...gtc(x, y), sgtc(rx), sgtc(ry), rot, startAngle, endAngle, anticlockwise);
                        };
                    } else if (prop === 'fillRect') {
                        return (x, y, w, h) => {
                            ctx.fillRect(...gtc(x, y), sgtc(w), -sgtc(h));
                        };
                    } else if (prop === 'fillText') {
                        return (text, x, y, maxWidth=false) => {
                            ctx.fillText(text, ...gtc(x, y), maxWidth === false ? undefined : sgtc(maxWidth));
                        };
                    } else if (prop === 'lineTo') {
                        return (x, y) => {
                            ctx.lineTo(...gtc(x, y));
                        };
                    } else if (prop === 'moveTo') {
                        return (x, y) => {
                            ctx.moveTo(...gtc(x, y));
                        };
                    } else if (prop === 'quadraticCurveTo') {
                        return (cpx, cpy, x, y) => {
                            ctx.quadraticCurveTo(...gtc(cpx, cpy), ...gtc(x, y));
                        };
                    } else if (prop === 'rect') {
                        return (x, y, w, h) => {
                            ctx.rect(...gtc(x, y), sgtc(w),-sgtc(h));
                        };
                    } else if (prop === 'strokeRect') {
                        return (x, y, w, h) => {
                            ctx.strokeRect(...gtc(x, y), sgtc(w), -sgtc(h));
                        };
                    } else if (prop === 'strokeText') {
                        return (text, x, y, maxWidth=false) => {
                            ctx.strokeText(text, ...gtc(x, y), maxWidth === false ? undefined : sgtc(maxWidth));
                        };
                    } else {
                        return target[prop];
                    }
                },
                set: (target, prop, value) => {
                    if (!affected.includes(prop)) target[prop] = value;
                },
            });

            this.drawer(wrappedCtx, context);
        }
    }

    /**
     * @typedef {Object} GraphOptions
     * @property {?boolean} fullsize - Indicates whether the graph should take up the whole screen
     * @property {?boolean} autosize - If true, width and height are equal to size of parent container
     * @property {?number} width - Width of graph in px if not fullscreen
     * @property {?number} height - Height of graph in px if not fullscreen
     * @property {?number} defaultZoom - The radius on x axis visible by default
     * @property {?number[]} defaultCenter - The default point to display as center of the screen
     */

    module.exports = Graph;
    Graph.StrokeStyle = StrokeStyle;
    Graph.FillStyle = FillStyle;
    Graph.GraphLine = GraphLine;
    Graph.GraphCircle = GraphCircle;
    Graph.GraphPoint = GraphPoint;
    Graph.GraphRect = GraphRect;
    Graph.GraphFunc = GraphFunc;
    Graph.GraphText = GraphText;
    Graph.GraphWrapper = GraphWrapper;
    Graph.GraphDrawer = GraphDrawer;

    return module;
})(typeof module !== "undefined" ? module : {}).exports; // eslint-disable-line