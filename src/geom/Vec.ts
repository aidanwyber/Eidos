import { Rect } from './Rect';

export class Vec {
	x: number;
	y: number;

	constructor(x: Vec);
	constructor(x: number, y: number);
	constructor(
		x: Vec | { x: number; y: number; [key: string]: any } | number,
		y?: number
	) {
		if (x instanceof Vec || typeof x === 'object') {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y!;
		}
	}

	copy(): Vec {
		return new Vec(this.x, this.y);
	}

	set(x: Vec | number, y?: number): Vec {
		if (x instanceof Vec) {
			this.x = x.x;
			this.y = x.y;
			return this;
		}
		this.x = x;
		this.y = y!;
		return this;
	}

	clear() {
		this.set(0, 0);
	}

	add(v: Vec): Vec {
		return new Vec(this.x + v.x, this.y + v.y);
	}
	addSelf(v: Vec): Vec {
		this.set(this.add(v));
		return this;
	}

	sub(v: Vec): Vec {
		return new Vec(this.x - v.x, this.y - v.y);
	}
	subSelf(v: Vec): Vec {
		this.set(this.sub(v));
		return this;
	}

	scale(s: number): Vec {
		return new Vec(this.x * s, this.y * s);
	}
	scaleSelf(s: number): Vec {
		this.set(this.scale(s));
		return this;
	}
	div(s: number): Vec {
		return new Vec(this.x / s, this.y / s);
	}
	divSelf(s: number): Vec {
		this.set(this.div(s));
		return this;
	}

	dot(v: Vec): number {
		return this.x * v.x + this.y * v.y;
	}

	magSq(): number {
		return this.dot(this);
	}
	mag(): number {
		return Math.sqrt(this.magSq());
	}

	normalize(): Vec {
		let m = this.mag();
		if (m > Vec.EPSILON) {
			return this.scale(1 / m);
		}
		return new Vec(0, 0);
	}
	normalizeSelf(): Vec {
		this.set(this.normalize());
		return this;
	}

	normalizeTo(len: number): Vec {
		return this.normalize().scale(len);
	}
	normalizeToSelf(len: number): Vec {
		this.set(this.normalizeTo(len));
		return this;
	}

	distanceToSq(v: Vec) {
		return this.sub(v).magSq();
	}
	distanceTo(v: Vec) {
		return this.sub(v).mag();
	}

	/**
	 * Rotates 90 degrees anti-clockwise in a standard XY graph, which is clockwise in a top-left origin pixel canvas, same direction as (cos th, sin th)
	 */
	perp(): Vec {
		return new Vec(-this.y, this.x);
	}
	/**
	 * Rotates 90 degrees anti-clockwise in a standard XY graph, which is clockwise in a top-left origin pixel canvas, same direction as (cos th, sin th)
	 */
	perpSelf(): Vec {
		this.set(this.perp());
		return this;
	}

	rotate(theta: number): Vec {
		let cos = Math.cos(theta);
		let sin = Math.sin(theta);
		return new Vec(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos
		);
	}
	rotateSelf(theta: number): Vec {
		this.set(this.rotate(theta));
		return this;
	}

	constrain(bounds: Rect): Vec {
		if (this.x < bounds.a.x) {
			return new Vec(bounds.a.x, this.y);
		}
		if (this.x > bounds.b.x) {
			return new Vec(bounds.b.x, this.y);
		}
		if (this.y < bounds.a.y) {
			return new Vec(this.x, bounds.a.y);
		}
		if (this.y > bounds.b.y) {
			return new Vec(this.x, bounds.b.y);
		}
		return this.copy();
	}
	constrainSelf(bounds: Rect): Vec {
		this.set(this.constrain(bounds));
		return this;
	}

	lerp(v: Vec, t: number): Vec {
		return this.scale(1 - t).add(v.scale(t));
	}
	lerpSelf(v: Vec, t: number): Vec {
		this.set(this.lerp(v, t));
		return this;
	}

	midPointTo(v: Vec): Vec {
		return this.lerp(v, 0.5);
	}

	angleTo(v: Vec): number {
		return Vec.angleBetween(this, v);
	}

	angle(): number {
		return Math.atan2(this.y, this.x);
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}

	projectOnto(v: Vec): Vec {
		let dp = this.dot(v);
		let magSq = v.magSq();
		if (magSq === 0) return new Vec(0, 0);
		let scalar = dp / magSq;
		return v.scale(scalar);
	}
	projectOntoSelf(v: Vec): Vec {
		this.set(this.projectOnto(v));
		return this;
	}

	equals(v: Vec) {
		return this.sub(v).magSq() < Vec.EPSILON;
	}

	static EPSILON = 1e-5;

	static random2D(): Vec {
		let angle = Math.random() * Math.PI * 2;
		return new Vec(Math.cos(angle), Math.sin(angle));
	}

	static fromAngle(angle: number): Vec {
		return new Vec(Math.cos(angle), Math.sin(angle));
	}

	static get ZERO(): Vec {
		return new Vec(0, 0);
	}

	static get X(): Vec {
		return new Vec(1, 0);
	}

	static get Y(): Vec {
		return new Vec(0, 1);
	}

	static angleBetween(a: Vec, b: Vec): number {
		let dot = a.dot(b);
		let mags = a.mag() * b.mag();
		if (mags === 0) return 0;
		let amt = dot / mags;
		if (amt <= -1) return Math.PI;
		if (amt >= 1) return 0;
		return Math.acos(amt);
	}

	static angleFromTo(a: Vec, b: Vec): number {
		return Math.atan2(b.y - a.y, b.x - a.x);
	}
}
