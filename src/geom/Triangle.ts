import { Line } from './Line';
import { Vec } from './Vec';

export class Triangle {
	a: Vec;
	b: Vec;
	c: Vec;
	constructor(a: Vec, b: Vec, c: Vec) {
		this.a = a;
		this.b = b;
		this.c = c;
	}

	copy(): Triangle {
		return new Triangle(this.a.copy(), this.b.copy(), this.c.copy());
	}

	getCentroid(): Vec {
		return this.a.add(this.b).add(this.c).divSelf(3);
	}

	getArea(): number {
		const { a, b, c } = this;
		return Math.abs(
			(a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2
		);
	}

	getCircumference() {
		return (
			this.a.distanceTo(this.b) +
			this.b.distanceTo(this.c) +
			this.c.distanceTo(this.a)
		);
	}

	closestPointTo(point: Vec) {
		const edge = new Line(this.a, this.b),
			Rab = edge.closestPointTo(point),
			Rbc = edge.set(this.b, this.c).closestPointTo(point),
			Rca = edge.set(this.c, this.a).closestPointTo(point),
			dAB = point.sub(Rab).magSq(),
			dBC = point.sub(Rbc).magSq(),
			dCA = point.sub(Rca).magSq();
		let min = dAB,
			result = Rab;
		if (dBC < min) {
			min = dBC;
			result = Rbc;
		}
		if (dCA < min) {
			result = Rca;
		}
		return result;
	}
}
