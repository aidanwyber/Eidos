import { Vec } from '../geom/Vec';
import { Particle } from './Particle';
import type { PhysicsEngine } from './PhysicsEngine';

/**
 * Removes particles that enter a given radius around the sink position.
 */
export class ParticleSink extends Particle {
	physics: PhysicsEngine;
	isAbsorbing = true;

	constructor(physics: PhysicsEngine, position: Vec, radius: number) {
		super(position, radius);
		this.physics = physics;
		this.lock();
	}

	absorb(): void {
		if (!this.isAbsorbing) return;
		const remaining: Particle[] = [];
		for (const particle of this.physics.particles) {
			if (!this.isIntersecting(particle)) {
				remaining.push(particle);
			}
		}
		this.physics.particles = remaining;
	}
}
