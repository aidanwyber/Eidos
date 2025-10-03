import type { Vec } from '../geom/Vec';
import { PhysicsEngine, Spring, Particle } from './index';

export class SpringChain {
	particles: Particle[];

	constructor(
		physics: PhysicsEngine,
		firstParticle: Particle,
		dir: Vec,
		length: number,
		segmentCount: number,
		k: number
	) {
		this.particles = [firstParticle];
		const segmentLength = length / segmentCount;
		const segmentVector = dir.scale(segmentLength);

		let lastParticle = firstParticle;
		physics.addParticle(firstParticle);
		for (let i = 0; i < segmentCount; i++) {
			let p = new Particle(lastParticle.add(segmentVector));
			this.particles.push(p);
			physics.addParticle(p);
			lastParticle = p;
		}

		for (let i = 0; i < this.particles.length - 1; i++) {
			let pi = this.particles[i] as Particle;
			let pn = this.particles[i + 1] as Particle;
			new Spring(pi, pn, segmentLength, k);
		}
	}

	// draw() {
	// 	beginShape();
	// 	for (let p of this.particles) {
	// 		vertex(p.x, p.y);
	// 	}
	// 	endShape();
	// }
}
