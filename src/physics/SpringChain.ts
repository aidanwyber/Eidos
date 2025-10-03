import type { Vec } from '../geom/Vec';
import { PhysicsEngine, Spring, Particle } from './index';

export class SpringChain {
	particles: Particle[] = [];

	constructor(
		physics: PhysicsEngine,
		firstParticle: Particle,
		segmentVector: Vec,
		segmentCount: number,
		k: number
	) {
		this.particles.push(firstParticle);
		for (let i = 0; i < segmentCount; i++) {
			this.particles.push(
				new Particle(this.particles.at(-1).add(segmentVector))
			);
		}
		for (let p of this.particles) physics.addParticle(p);

		const segmentLength = segmentVector.mag();
		for (let i = 0; i < this.particles.length - 1; i++) {
			let pi = this.particles[i];
			let pn = this.particles[i + 1];
			new Spring(pi, pn, segmentLength, k);
		}
	}

	draw() {
		beginShape();
		for (let p of this.particles) {
			vertex(p.x, p.y);
		}
		endShape();
	}
}
