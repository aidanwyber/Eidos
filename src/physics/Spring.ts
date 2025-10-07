import { Constraint } from './constraints/Constraint';
import type { Particle } from './Particle';
import { PhysicalObject } from './Physical';

export class Spring implements PhysicalObject {
	a: Particle;
	b: Particle;
	restLength: number;
	strength: number;

	static EPSILON: number = 1e-6;

	constructor(
		a: Particle,
		b: Particle,
		strength: number,
		restLength?: number
	) {
		this.a = a;
		this.b = b;
		this.strength = strength;
		this.restLength = restLength ?? a.distanceTo(b);

		a.addSpring(this);
		b.addSpring(this);
	}

	/**
	 * spring dynamics from toxiclibsjs
	 */
	update(doApplyConstraints: boolean) {
		const diff = this.b.sub(this.a);
		// add minute offset to avoid div-by-zero errors
		const dist = diff.mag() + Spring.EPSILON;
		const normDistStrength =
			((dist - this.restLength) /
				(dist * (this.a.inverseMass + this.b.inverseMass))) *
			this.strength;

		if (!this.a.isLocked) {
			this.a.addSelf(diff.scale(normDistStrength * this.a.inverseMass));
			if (doApplyConstraints) this.a.applyConstraints();
		}
		if (!this.b.isLocked) {
			this.b.addSelf(diff.scale(-normDistStrength * this.b.inverseMass));
			if (doApplyConstraints) this.b.applyConstraints();
		}
	}

	addConstraint(constraint: Constraint) {}

	removeConstraint(constraint: Constraint) {}

	// draw(sketch: p5) {
	// 	const n = Math.floor(this.b.distanceTo(this.a) * 0.2);
	// 	const delta = this.b.sub(this.a).div(n);
	// 	const deltaPerp = delta.perp();
	// 	const zig = delta.rotate(Math.PI / 4).scale(Math.SQRT2 / 2);
	// 	sketch.beginShape();
	// 	sketch.vertex(this.a.x, this.a.y);
	// 	for (let i = 1; i <= n; i++) {
	// 		const zigPos = this.a
	// 			.add(delta.scale(i - 0.5))
	// 			.add(deltaPerp.scale(i % 2 === 0 ? 1 : -1));
	// 		const nextPos = this.a.add(delta.scale(i));
	// 		sketch.vertex(zigPos.x, zigPos.y);
	// 		sketch.vertex(nextPos.x, nextPos.y);
	// 	}
	// 	sketch.endShape();
	// 	// line(this.a.x, this.a.y, this.b.x, this.b.y);
	// }
}
