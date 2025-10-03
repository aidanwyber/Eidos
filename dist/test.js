import p5 from 'p5';
new p5((sketch) => {
    let canvas;
    let width = 1000, height = 1000;
    sketch.setup = () => {
        canvas = sketch.createCanvas(1000, 1000, document.querySelector('canvas'));
    };
    sketch.draw = () => {
        const t = sketch.millis();
        sketch.circle(t * width, height * 0.5, 200);
    };
});
//# sourceMappingURL=test.js.map