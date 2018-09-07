import Vector from "../Vector";

export default function Render(ctx, points) {
    const { width, height } = ctx.canvas;

    const pixels = (new Uint8ClampedArray(width * height * 4))
        .map((v, i) => i % 4 === 3 ? 255 : v)
    ;
    const setPixel = (x, y, r, g, b, a=255) => {
        if (x > width || x < 0 || y > height || y < 0) return;
        const i = (Math.floor(y) * width + Math.floor(x)) * 4;
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
        pixels[i + 3] = a;
    };

    const negatives = points.filter(v => v.charge < 0);
    const positives = points.filter(v => v.charge > 0);
    const sortedPoints = [...positives, ...negatives];

    sortedPoints.forEach(pointCharge => {
        const { x, y } = pointCharge.pos;

        const LINE_MULT = 8;
        const START_SKIP = 10;
        const LINE_LENGTH = 1400;
        const SKIP = 5; // increases speed :), reduces accuracy :(

        const num_lines = Math.abs(Math.floor(pointCharge.charge)) * LINE_MULT;
        const delta_angle = Math.PI * 2 / num_lines;

        const iters = Math.ceil(LINE_LENGTH / SKIP);
        for (let angle = 0; angle < Math.PI * 2; angle += delta_angle) {
            let pos = new Vector(x, y);
            pos = pos.add(Vector.FromAngle(angle, START_SKIP));

            /* if the charge is negative, check if field lines
             * are already drawn to here
             * If they are, don't draw the this line
             */

            for (let iter = 0; iter < iters; iter++) {
                // get dir of field at x, y
                const field = points.reduce(
                    (field, pc) => field.add(pc.field(pos)), new Vector(0, 0)
                );

                // draw points along the direction of field `skip` times
                // probably increases speed
                const step = pointCharge.charge > 0 ? field.normalize() : field.scale(1).normalize();
                for (let i = 0; i <= SKIP; i++) {
                    setPixel(pos.x, pos.y, 180, 210, 255);
                    pos = pos.add(step);
                }

                // now to implement a polygon rasterizer to raster triangles
                // would probably be smarter to draw them using the ctx api

                if (pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height) {
                    break;
                }
            }
        }
    });

    const image_data = new ImageData(pixels, width, height);
    ctx.putImageData(image_data, 0, 0);
}