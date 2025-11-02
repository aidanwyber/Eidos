import { Renderer } from '../types/Renderer';
import { Renderable } from '../types/Renderable';
import { Vec } from './Vec';

export class Rect implements Renderable {
	public a: Vec; // top-left
	public b: Vec; // bottom-right

	constructor(x: number, y: number, width: number, height: number);
	constructor(a: Vec, b: Vec);
	constructor(
		arg1: number | Vec,
		arg2: number | Vec,
		arg3?: number,
		arg4?: number
	) {
		if (arg1 instanceof Vec && arg2 instanceof Vec) {
			this.a = arg1;
			this.b = arg2;
		} else if (
			typeof arg1 === 'number' &&
			typeof arg2 === 'number' &&
			typeof arg3 === 'number' &&
			typeof arg4 === 'number'
		) {
			this.a = new Vec(arg1, arg2);
			this.b = new Vec(arg1 + arg3, arg2 + arg4);
		} else {
			throw new Error('Invalid constructor arguments for Rect');
		}
	}

	get x(): number {
		return this.a.x;
	}

	get y(): number {
		return this.a.y;
	}

	get width(): number {
		return this.b.x - this.a.x;
	}

	get height(): number {
		return this.b.y - this.a.y;
	}

	get area(): number {
		return this.width * this.height;
	}

	containsPoint(p: Vec): boolean {
		return (
			p.x >= this.a.x &&
			p.x <= this.b.x &&
			p.y >= this.a.y &&
			p.y <= this.b.y
		);
	}

	getCenter(): Vec {
		return this.a.lerp(this.b, 0.5);
	}

	copy(): Rect {
		return new Rect(this.x, this.y, this.width, this.height);
	}

	translate(dx: number, dy: number): Rect {
		return new Rect(this.x + dx, this.y + dy, this.width, this.height);
	}

	intersects(other: Rect): boolean {
		return !(
			other.b.x < this.a.x ||
			other.a.x > this.b.x ||
			other.b.y < this.a.y ||
			other.a.y > this.b.y
		);
	}

	shrink(inset: number) {
		const insetVec = new Vec(inset, inset);
		return new Rect(this.a.add(insetVec), this.b.sub(insetVec));
	}

	union(other: Rect): Rect {
		const x1 = Math.min(this.a.x, other.a.x);
		const y1 = Math.min(this.a.y, other.a.y);
		const x2 = Math.max(this.b.x, other.b.x);
		const y2 = Math.max(this.b.y, other.b.y);
		return new Rect(new Vec(x1, y1), new Vec(x2, y2));
	}

	intersection(other: Rect): Rect | null {
		const x1 = Math.max(this.a.x, other.a.x);
		const y1 = Math.max(this.a.y, other.a.y);
		const x2 = Math.min(this.b.x, other.b.x);
		const y2 = Math.min(this.b.y, other.b.y);

		if (x2 >= x1 && y2 >= y1) {
			return new Rect(new Vec(x1, y1), new Vec(x2, y2));
		}
		return null;
	}

	draw(renderer: Renderer) {
		renderer.rect(this.x, this.y, this.width, this.height);
	}

	static boundingRect(points: Vec[]): Rect {
		if (points.length === 0) {
			throw new Error(
				'Cannot compute bounding rect of empty point array'
			);
		}
		let minX = points[0].x;
		let minY = points[0].y;
		let maxX = points[0].x;
		let maxY = points[0].y;
		for (let p of points) {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		}
		return new Rect(minX, minY, maxX - minX, maxY - minY);
	}
}
