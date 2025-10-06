import { p5 } from 'p5';
import { Constraint } from './constraints/Constraint';
import type { Particle } from './Particle';
import { Physical } from './Physical';

export class Spring implements Physical {
	a: Particle;
	b: Particle;
	restLength: number;
	constant: number;

	// damping: number = 0.05;

	static epsilon: number = 1e-2;

	constructor(
		a: Particle,
		b: Particle,
		constant: number,
		restLength?: number
	) {
		this.a = a;
		this.b = b;
		this.constant = constant;
		this.restLength = restLength ?? a.distanceTo(b);
		console.log('restlen', this.restLength);

		a.addSpring(this);
		b.addSpring(this);
	}

	update() {
		const diff = this.b.sub(this.a);
		const dx = diff.mag() - this.restLength;
		if (Math.abs(dx) > Spring.epsilon) {
			const force = diff.normalizeTo(this.constant * -dx);
			this.a.addForce(force.scale(-0.5));
			this.b.addForce(force.scale(+0.5));
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
