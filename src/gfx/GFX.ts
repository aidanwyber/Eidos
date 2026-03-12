import { Particle } from '../physics/Particle';
import { Spring } from '../physics/Spring';
import { Vec } from '../geom/Vec';

type SketchConstant = string | number;

export interface SketchLike {
	push(): void;
	pop(): void;
	translate(x: number, y: number): void;
	rotate(angle: number): void;
	scale(s: number, y?: number): void;

	line(x1: number, y1: number, x2: number, y2: number): void;
	circle(x: number, y: number, diameter: number): void;
	ellipse(x: number, y: number, w: number, h: number): void;
	rect(x: number, y: number, w: number, h: number): void;
	point(x: number, y: number): void;

	beginShape(kind?: SketchConstant): void;
	vertex(x: number, y: number): void;
	curveVertex(x: number, y: number): void;
	endShape(mode?: SketchConstant): void;
	curveTightness(tension: number): void;
	bezier(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number,
	): void;

	strokeWeight(weight: number): void;
	stroke(...args: number[]): void;
	text(str: string, x: number, y: number): void;
	textAlign(horizAlign: SketchConstant, vertAlign?: SketchConstant): void;

	CLOSE: SketchConstant;
	CENTER: SketchConstant;
	RIGHT: SketchConstant;
	LEFT: SketchConstant;
	TOP: SketchConstant;
	BOTTOM: SketchConstant;
}

export type P5Plus = SketchLike;

export class GFX {
	private sketch: SketchLike;
	private defaultStrokeWeight: number = 1;
	private defaultParticleSize: number = 5;

	constructor(sketch: SketchLike) {
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
		this.sketch.translate(x, y);
	}

	rotate(angle: number): void {
		this.sketch.rotate(angle);
	}

	scale(s: number): void;
	scale(x: number, y: number): void;
	scale(x: number, y?: number): void {
		if (y === undefined) {
			this.sketch.scale(x);
		} else {
			this.sketch.scale(x, y);
		}
	}

	// Physics rendering
	particle(p: Particle, size?: number): void {
		const s = size ?? this.defaultParticleSize;
		this.sketch.circle(p.x, p.y, s);
	}

	particles(particles: Particle[], size?: number): void {
		particles.forEach(p => this.particle(p, size));
	}

	spring(s: Spring, showRestLength: boolean = false): void {
		this.sketch.line(s.a.x, s.a.y, s.b.x, s.b.y);

		if (showRestLength) {
			const mid = s.a.copy().add(s.b).scale(0.5);
			const angle = Math.atan2(s.b.y - s.a.y, s.b.x - s.a.x);
			this.sketch.push();
			this.sketch.translate(mid.x, mid.y);
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
		arrowSize: number = 5,
	): void {
		const end = origin.copy().add(vec.copy().scale(scale));
		this.arrow(origin, end, arrowSize);
	}

	arrow(from: Vec, to: Vec, arrowSize: number = 5): void {
		this.sketch.line(from.x, from.y, to.x, to.y);

		const angle = Math.atan2(to.y - from.y, to.x - from.x);
		this.sketch.push();
		this.sketch.translate(to.x, to.y);
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
			this.sketch.rect(a.x, a.y, b, c);
		} else if (typeof a === 'number' && d !== undefined) {
			this.sketch.rect(a, b, c, d);
		}
	}

	point(v: Vec): void;
	point(x: number, y: number): void;
	point(a: Vec | number, b?: number): void {
		if (a instanceof Vec) {
			this.sketch.point(a.x, a.y);
		} else if (typeof a === 'number' && b !== undefined) {
			this.sketch.point(a, b);
		}
	}

	// Polygon drawing
	polygon(vertices: Vec[]): void {
		if (vertices.length < 3) return;

		this.sketch.beginShape();
		vertices.forEach(v => this.sketch.vertex(v.x, v.y));
		this.sketch.endShape(this.sketch.CLOSE);
	}

	polyline(vertices: Vec[]): void {
		if (vertices.length < 2) return;

		this.sketch.beginShape();
		vertices.forEach(v => this.sketch.vertex(v.x, v.y));
		this.sketch.endShape();
	}

	// Curves
	curve(points: Vec[], tension: number = 0): void {
		if (points.length < 4) return;

		this.sketch.curveTightness(tension);
		this.sketch.beginShape();
		points.forEach(p => this.sketch.curveVertex(p.x, p.y));
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
		offsetY: number = 0,
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
		},
	): void {
		if (align) {
			this.sketch.push();
			if (align.horizontal === 'center')
				this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
			else if (align.horizontal === 'right')
				this.sketch.textAlign(this.sketch.RIGHT);
			else if (align.vertical === 'center')
				this.sketch.textAlign(this.sketch.LEFT, this.sketch.CENTER);
			else if (align.vertical === 'top')
				this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
			else if (align.vertical === 'bottom')
				this.sketch.textAlign(this.sketch.LEFT, this.sketch.BOTTOM);

			this.sketch.text(str, pos.x, pos.y);
			this.sketch.pop();
		} else {
			this.sketch.text(str, pos.x, pos.y);
		}
	}
}
