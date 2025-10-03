import { Vec } from './Vec';

export class Rect {
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
}
