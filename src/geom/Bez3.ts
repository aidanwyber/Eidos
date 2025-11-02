import { Renderer } from '../types/Renderer';
import { Renderable } from '../types/Renderable';
import { Vec } from './Vec';

/**
 * Represents a cubic Bezier curve defined by four control points.
 *
 * The curve is defined by the start point (`pA`), two control points (`cA`, `cB`), and the end point (`pB`).
 * Provides methods for evaluating points on the curve, generating equidistant points, copying the curve,
 * linear interpolation, and string representation.
 *
 * @example
 * ```typescript
 * const curve = new Bez3(pA, cA, cB, pB);
 * const point = curve.evaluate(0.5); // get midpoint on the curve
 * const points = curve.getEquidistantPoints(10); // get 10 equidistant points
 * ```
 */
export class Bez3 implements Renderable {
	constructor(
		public pA: Vec,
		public cA: Vec,
		public cB: Vec,
		public pB: Vec
	) {}

	/**
	 * Create a copy of this Bezier curve
	 */
	copy(): Bez3 {
		return new Bez3(
			this.pA.copy(),
			this.cA.copy(),
			this.cB.copy(),
			this.pB.copy()
		);
	}

	/**
	 * Evaluate the cubic Bezier curve at parameter t
	 * @param t Parameter between 0 and 1
	 * @returns Point on the curve
	 */
	evaluate(t: number): Vec {
		const mt = 1 - t;
		const mt2 = mt * mt;
		const mt3 = mt2 * mt;
		const t2 = t * t;
		const t3 = t2 * t;

		return new Vec(
			mt3 * this.pA.x +
				3 * mt2 * t * this.cA.x +
				3 * mt * t2 * this.cB.x +
				t3 * this.pB.x,
			mt3 * this.pA.y +
				3 * mt2 * t * this.cA.y +
				3 * mt * t2 * this.cB.y +
				t3 * this.pB.y
		);
	}

	/**
	 * Split the curve into approximately equidistant points
	 * @param n Number of points to generate
	 * @returns Array of points along the curve
	 */
	getEquidistantPoints(n: number): Vec[] {
		if (n <= 1) return [this.pA.copy()];
		if (n === 2) return [this.pA.copy(), this.pB.copy()];

		const points: Vec[] = [];
		const arcLengthDivisions = 50; // number of divisions for arc length calculation
		const arcLengths: number[] = [0];
		let tempLength = 0;
		let lastPoint = this.pA.copy();

		// calculate approximate arc lengths
		for (let i = 1; i <= arcLengthDivisions; i++) {
			const t = i / arcLengthDivisions;
			const point = this.evaluate(t);
			tempLength += point.distanceTo(lastPoint);
			arcLengths.push(tempLength);
			lastPoint = point;
		}

		const totalLength = arcLengths[arcLengths.length - 1];

		// generate equidistant points
		for (let i = 0; i < n; i++) {
			const targetLength = (i * totalLength) / (n - 1);

			// binary search for the right arc length
			let low = 0;
			let high = arcLengthDivisions;
			let index = 0;

			while (low < high) {
				index = Math.floor(low + (high - low) / 2);
				if (arcLengths[index] < targetLength) {
					low = index + 1;
				} else {
					high = index;
				}
			}

			const lengthBefore = arcLengths[index - 1] || 0;
			const lengthAfter = arcLengths[index];
			const segmentLength = lengthAfter - lengthBefore;

			const t =
				index === 0 ? 0 : (targetLength - lengthBefore) / segmentLength;

			const finalT = (index + t) / arcLengthDivisions;
			points.push(this.evaluate(finalT));
		}

		return points;
	}

	/**
	 * Convert the Bezier curve to a string representation
	 */
	toString(): string {
		return `Bez3(${this.pA.toString()} -> ${this.cA.toString()} -> ${this.cB.toString()} -> ${this.pB.toString()})`;
	}

	draw(renderer: Renderer) {
		renderer.bezier(
			this.pA.x,
			this.pA.y,
			this.cA.x,
			this.cA.y,
			this.cB.x,
			this.cB.y,
			this.pB.x,
			this.pB.y
		);
	}

	drawBezierVertex(renderer: Renderer) {
		renderer.bezierVertex(
			this.cA.x,
			this.cA.y,
			this.cB.x,
			this.cB.y,
			this.pB.x,
			this.pB.y
		);
	}
}
