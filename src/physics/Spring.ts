import type { Particle } from './Particle';

export class Spring {
	a: Particle;
	b: Particle;
	restLength: number;
	k: number; // Spring constant

	damping: number = 0.05;

	static epsilon: number = 1e-2;

	constructor(a: Particle, b: Particle, restLength: number, k: number) {
		this.a = a;
		this.b = b;
		this.restLength = restLength === null ? a.distanceTo(b) : restLength;
		this.k = k;

		a.addSpring(this);
		b.addSpring(this);
	}

	apply() {
		const diff = this.b.sub(this.a);
		const dx = diff.mag() - this.restLength;
		if (Math.abs(dx) > Spring.epsilon) {
			const force = diff.normalizeTo(this.k * -dx);
			this.a.addForce(force.scale(-0.5));
			this.b.addForce(force.scale(+0.5));
		}
	}

	// draw() {
	// 	const n = Math.floor(this.b.distanceTo(this.a) * 0.2);
	// 	const delta = this.b.sub(this.a).div(n);
	// 	const deltaPerp = delta.perp();
	// 	const zig = delta.rotate(Math.PI / 4).scale(Math.SQRT2 / 2);
	// 	beginShape();
	// 	vertex(this.a.x, this.a.y);
	// 	for (let i = 1; i <= n; i++) {
	// 		const zigPos = this.a
	// 			.add(delta.scale(i - 0.5))
	// 			.add(deltaPerp.scale(i % 2 === 0 ? 1 : -1));
	// 		const nextPos = this.a.add(delta.scale(i));
	// 		vertex(zigPos.x, zigPos.y);
	// 		vertex(nextPos.x, nextPos.y);
	// 	}
	// 	endShape();
	// 	// line(this.a.x, this.a.y, this.b.x, this.b.y);
	// }
}
