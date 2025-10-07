import type { Vec } from '../geom/Vec';
import { Constraint } from './constraints/Constraint';
import { PhysicsEngine, Spring, Particle } from './index';
import type { PhysicalObject } from './Physical';

export class SpringChain implements PhysicalObject {
	particles: Particle[];
	springs: Spring[];

	constructor(
		firstParticle: Particle,
		dir: Vec,
		length: number,
		segmentCount: number,
		totalStrength: number
	) {
		this.particles = [firstParticle];
		const segmentLength = length / segmentCount;
		const segmentVector = dir.scale(segmentLength);

		let lastParticle = firstParticle;
		for (let i = 0; i < segmentCount; i++) {
			let p = new Particle(lastParticle.add(segmentVector));
			this.particles.push(p);
			lastParticle = p;
		}

		this.springs = [];
		const segmentStrength = totalStrength * segmentCount;
		for (let i = 0; i < this.particles.length - 1; i++) {
			let pi = this.particles[i];
			let pn = this.particles[i + 1];
			this.springs.push(new Spring(pi, pn, segmentStrength));
		}
	}

	addConstraint(constraint: Constraint) {}

	removeConstraint(constraint: Constraint) {}

	// draw() {
	// 	beginShape();
	// 	for (let p of this.particles) {
	// 		vertex(p.x, p.y);
	// 	}
	// 	endShape();
	// }
}
