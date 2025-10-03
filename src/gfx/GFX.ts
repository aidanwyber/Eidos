import p5 from 'p5';
import { Particle, Spring, Vec } from '../'; // Adjust import paths as needed

export class GFX {
	private sketch: p5;

	constructor(sketch: p5) {
		this.sketch = sketch;
	}

	particle(p: Particle, size: number = 10): void {
		this.sketch.push();
		this.sketch.noStroke();
		this.sketch.fill(200, 100, 100);
		this.sketch.circle(p.pos.x, p.pos.y, size);
		this.sketch.pop();
	}

	spring(s: Spring, showRestLength: boolean = false): void {
		this.sketch.push();
		this.sketch.stroke(100, 200, 100);
		this.sketch.line(s.a.pos.x, s.a.pos.y, s.b.pos.x, s.b.pos.y);
		if (showRestLength) {
			const midX = (s.a.pos.x + s.b.pos.x) / 2;
			const midY = (s.a.pos.y + s.b.pos.y) / 2;
			this.sketch.noStroke();
			this.sketch.fill(100, 100, 200);
			this.sketch.text(`rest: ${s.length}`, midX, midY);
		}
		this.sketch.pop();
	}

	line(v1: Vec, v2: Vec): void {
		this.sketch.push();
		this.sketch.stroke(0);
		this.sketch.line(v1.x, v1.y, v2.x, v2.y);
		this.sketch.pop();
	}

	circle(center: Vec, radius: number): void {
		this.sketch.push();
		this.sketch.noFill();
		this.sketch.stroke(0);
		this.sketch.circle(center.x, center.y, radius * 2);
		this.sketch.pop();
	}

	rect(topLeft: Vec, width: number, height: number): void {
		this.sketch.push();
		this.sketch.noFill();
		this.sketch.stroke(0);
		this.sketch.rect(topLeft.x, topLeft.y, width, height);
		this.sketch.pop();
	}

	arrow(from: Vec, to: Vec, arrowSize: number = 10): void {
		this.sketch.push();
		this.sketch.stroke(0);
		this.sketch.fill(0);
		this.sketch.line(from.x, from.y, to.x, to.y);

		// Arrowhead
		const angle = Math.atan2(to.y - from.y, to.x - from.x);
		this.sketch.push();
		this.sketch.translate(to.x, to.y);
		this.sketch.rotate(angle);
		this.sketch.triangle(
			0,
			0,
			-arrowSize,
			arrowSize / 2,
			-arrowSize,
			-arrowSize / 2
		);
		this.sketch.pop();
		this.sketch.pop();
	}

	vector(origin: Vec, vec: Vec, scale: number = 1): void {
		const to = new Vec(origin.x + vec.x * scale, origin.y + vec.y * scale);
		this.arrow(origin, to, 10);
	}
}
