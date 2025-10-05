import type p5 from 'p5';
import { Particle } from '../physics/Particle';
import { Spring } from '../physics/Spring';
import { Vec } from '../geom/Vec';

export type P5Plus = p5 & { [key: string]: any };

export class GFX {
	private sketch: P5Plus;
	private defaultStrokeWeight: number = 1;
	private defaultParticleSize: number = 5;

	constructor(sketch: P5Plus) {
		this.sketch = sketch;
	}

	// Configuration
	setDefaultParticleSize(size: number): void {
		this.defaultParticleSize = size;
	}

	setDefaultStrokeWeight(weight: number): void {
		this.defaultStrokeWeight = weight;
	}

	// Utility methods
	push(): void {
		this.sketch.push();
	}

	pop(): void {
		this.sketch.pop();
	}

	translate(x: number, y: number): void {
		// @ts-ignore
		this.sketch.translate(x, y);
	}

	rotate(angle: number): void {
		// @ts-ignore
		this.sketch.rotate(angle);
	}

	scale(s: number): void;
	scale(x: number, y: number): void;
	scale(x: number, y?: number): void {
		if (y === undefined) {
			this.sketch.scale(x);
		} else {
			// @ts-ignore
			this.sketch.scale(x, y);
		}
	}

	// Physics rendering
	particle(p: Particle, size?: number): void {
		const s = size ?? this.defaultParticleSize;
		// @ts-ignore
		this.sketch.circle(p.position.x, p.position.y, s);
	}

	particles(particles: Particle[], size?: number): void {
		particles.forEach(p => this.particle(p, size));
	}

	spring(s: Spring, showRestLength: boolean = false): void {
		this.sketch.line(
			// @ts-ignore
			s.a.position.x,
			// @ts-ignore
			s.a.position.y,
			// @ts-ignore
			s.b.position.x,
			// @ts-ignore
			s.b.position.y
		);

		if (showRestLength) {
			// @ts-ignore
			const mid = s.a.position.copy().add(s.b.position).scale(0.5);
			const angle = Math.atan2(
				// @ts-ignore
				s.b.position.y - s.a.position.y,
				// @ts-ignore
				s.b.position.x - s.a.position.x
			);
			this.sketch.push();
			// @ts-ignore
			this.sketch.translate(mid.x, mid.y);
			// @ts-ignore
			this.sketch.rotate(angle);
			this.sketch.strokeWeight(0.5);
			this.sketch.stroke(255, 0, 0, 100);
			this.sketch.line(-s.restLength / 2, 0, s.restLength / 2, 0);
			this.sketch.pop();
		}
	}

	springs(springs: Spring[], showRestLength: boolean = false): void {
		springs.forEach(s => this.spring(s, showRestLength));
	}

	// Vector drawing
	vector(
		origin: Vec,
		vec: Vec,
		scale: number = 1,
		arrowSize: number = 5
	): void {
		const end = origin.copy().add(vec.copy().scale(scale));
		this.arrow(origin, end, arrowSize);
	}

	arrow(from: Vec, to: Vec, arrowSize: number = 5): void {
		this.sketch.line(from.x, from.y, to.x, to.y);

		const angle = Math.atan2(to.y - from.y, to.x - from.x);
		this.sketch.push();
		// @ts-ignore
		this.sketch.translate(to.x, to.y);
		// @ts-ignore
		this.sketch.rotate(angle);
		this.sketch.line(0, 0, -arrowSize, -arrowSize / 2);
		this.sketch.line(0, 0, -arrowSize, arrowSize / 2);
		this.sketch.pop();
	}

	// Basic shapes
	line(v1: Vec, v2: Vec): void;
	line(x1: number, y1: number, x2: number, y2: number): void;
	line(a: Vec | number, b: Vec | number, c?: number, d?: number): void {
		if (a instanceof Vec && b instanceof Vec) {
			this.sketch.line(a.x, a.y, b.x, b.y);
		} else if (
			typeof a === 'number' &&
			typeof b === 'number' &&
			c !== undefined &&
			d !== undefined
		) {
			this.sketch.line(a, b, c, d);
		}
	}

	circle(center: Vec, radius: number): void;
	circle(x: number, y: number, radius: number): void;
	circle(a: Vec | number, b: number, c?: number): void {
		if (a instanceof Vec) {
			this.sketch.circle(a.x, a.y, b * 2);
		} else if (typeof a === 'number' && c !== undefined) {
			this.sketch.circle(a, b, c * 2);
		}
	}

	ellipse(center: Vec, width: number, height: number): void;
	ellipse(x: number, y: number, width: number, height: number): void;
	ellipse(a: Vec | number, b: number, c: number, d?: number): void {
		if (a instanceof Vec) {
			this.sketch.ellipse(a.x, a.y, b, c);
		} else if (typeof a === 'number' && d !== undefined) {
			this.sketch.ellipse(a, b, c, d);
		}
	}

	rect(topLeft: Vec, width: number, height: number): void;
	rect(x: number, y: number, width: number, height: number): void;
	rect(a: Vec | number, b: number, c: number, d?: number): void {
		if (a instanceof Vec) {
			// @ts-ignore
			this.sketch.rect(a.x, a.y, b, c);
		} else if (typeof a === 'number' && d !== undefined) {
			// @ts-ignore
			this.sketch.rect(a, b, c, d);
		}
	}

	point(v: Vec): void;
	point(x: number, y: number): void;
	point(a: Vec | number, b?: number): void {
		if (a instanceof Vec) {
			// @ts-ignore
			this.sketch.point(a.x, a.y);
		} else if (typeof a === 'number' && b !== undefined) {
			// @ts-ignore
			this.sketch.point(a, b);
		}
	}

	// Polygon drawing
	polygon(vertices: Vec[]): void {
		if (vertices.length < 3) return;

		// @ts-ignore
		this.sketch.beginShape();
		vertices.forEach(v => this.sketch.vertex(v.x, v.y));
		// @ts-ignore
		this.sketch.endShape(this.sketch.CLOSE);
	}

	polyline(vertices: Vec[]): void {
		if (vertices.length < 2) return;

		// @ts-ignore
		this.sketch.beginShape();
		vertices.forEach(v => this.sketch.vertex(v.x, v.y));
		// @ts-ignore
		this.sketch.endShape();
	}

	// Curves
	curve(points: Vec[], tension: number = 0): void {
		if (points.length < 4) return;

		// @ts-ignore
		this.sketch.curveTightness(tension);
		// @ts-ignore
		this.sketch.beginShape();
		// @ts-ignore
		points.forEach(p => this.sketch.curveVertex(p.x, p.y));
		// @ts-ignore
		this.sketch.endShape();
	}

	bezier(p0: Vec, p1: Vec, p2: Vec, p3: Vec): void {
		this.sketch.bezier(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
	}

	// Grid and guides
	grid(
		spacing: number,
		width: number,
		height: number,
		offsetX: number = 0,
		offsetY: number = 0
	): void {
		this.sketch.push();
		this.sketch.strokeWeight(0.5);

		// Vertical lines
		for (let x = offsetX % spacing; x < width; x += spacing) {
			this.sketch.line(x, 0, x, height);
		}

		// Horizontal lines
		for (let y = offsetY % spacing; y < height; y += spacing) {
			this.sketch.line(0, y, width, y);
		}

		this.sketch.pop();
	}

	crosshair(center: Vec, size: number = 10): void {
		this.sketch.line(center.x - size, center.y, center.x + size, center.y);
		this.sketch.line(center.x, center.y - size, center.x, center.y + size);
	}

	// Text helpers
	text(
		str: string,
		pos: Vec,
		align?: {
			horizontal?: 'left' | 'center' | 'right';
			vertical?: 'top' | 'center' | 'bottom';
		}
	): void {
		if (align) {
			this.sketch.push();
			if (align.horizontal === 'center')
				// @ts-ignore
				this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
			else if (align.horizontal === 'right')
				// @ts-ignore
				this.sketch.textAlign(this.sketch.RIGHT);
			else if (align.vertical === 'center')
				// @ts-ignore
				this.sketch.textAlign(this.sketch.LEFT, this.sketch.CENTER);
			else if (align.vertical === 'top')
				// @ts-ignore
				this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
			else if (align.vertical === 'bottom')
				// @ts-ignore
				this.sketch.textAlign(this.sketch.LEFT, this.sketch.BOTTOM);

			// @ts-ignore
			this.sketch.text(str, pos.x, pos.y);
			this.sketch.pop();
		} else {
			// @ts-ignore
			this.sketch.text(str, pos.x, pos.y);
		}
	}
}
