import { Renderable } from '../types/Renderable';
import { Renderer } from '../types/Renderer';
import { Vec } from './Vec';

export class Poly implements Renderable {
	constructor(public points: Vec[]) {}

	copy(): Poly {
		return new Poly(this.points.map(p => p.copy()));
	}

	getArea(): number {
		let area = 0;
		const n = this.points.length;
		for (let i = 0; i < n; i++) {
			const pA = this.points[i];
			const pB = this.points[(i + 1) % n];
			area += pA.x * pB.y - pB.x * pA.y;
		}
		return Math.abs(area) / 2;
	}

	isClockwise(): boolean {
		let sum = 0;
		const n = this.points.length;
		for (let i = 0; i < n; i++) {
			const pA = this.points[i];
			const pB = this.points[(i + 1) % n];
			sum += (pB.x - pA.x) * (pB.y + pA.y);
		}
		return sum > 0;
	}

	evaluate(t: number): Vec {
		t = t % 1;
		const n = this.points.length;
		if (n === 0) throw new Error('Cannot evaluate an empty Poly');
		if (t <= 0) return this.points[0].copy();
		if (t >= 1) return this.points[n - 1].copy();
		const totalLength = this.getTotalLength();
		const targetLength = t * totalLength;
		let accumulatedLength = 0;
		for (let i = 0; i < n - 1; i++) {
			const pA = this.points[i];
			const pB = this.points[i + 1];
			const segmentLength = pA.distanceTo(pB);
			if (accumulatedLength + segmentLength >= targetLength) {
				const segmentT =
					(targetLength - accumulatedLength) / segmentLength;
				return new Vec(
					pA.x + (pB.x - pA.x) * segmentT,
					pA.y + (pB.y - pA.y) * segmentT
				);
			}
			accumulatedLength += segmentLength;
		}
		return this.points[n - 1].copy();
	}

	getTotalLength(): number {
		let length = 0;
		const n = this.points.length;
		for (let i = 0; i < n - 1; i++) {
			length += this.points[i].distanceTo(this.points[i + 1]);
		}
		return length;
	}

	draw(renderer: Renderer) {
		renderer.push();
		renderer.beginShape();
		for (const p of this.points) {
			renderer.vertex(p.x, p.y);
		}
		renderer.endShape(renderer.CLOSE);
	}
}
