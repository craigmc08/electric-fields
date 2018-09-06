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

    points.forEach(pointCharge => {
        const { x, y } = pointCharge.pos;

        const num_lines = Math.abs(Math.floor(pointCharge.charge)) * 8;
        const line_length = 1000;
        const skip = 5; // increases speed :), reduces accuracy :(
        const delta_angle = Math.PI * 2 / num_lines;

        const iters = Math.ceil(line_length / skip);
        for (let angle = 0; angle < Math.PI * 2; angle += delta_angle) {
            let pos = new Vector(x, y);
            pos = pos.add(Vector.FromAngle(angle, 10));
            for (let iter = 0; iter < iters; iter++) {
                // get deriv of field at x, y
                const field = points.reduce(
                    (field, pc) => field.add(pc.field(pos)), new Vector(0, 0)
                );

                // draw points along the direction of field `skip` times
                // probably increases speed
                const step = field.normalize();
                for (let i = 0; i <= skip; i++) {
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