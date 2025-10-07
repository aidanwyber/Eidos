import { Vec } from '../geom/Vec';
import { Constraint } from './constraints/Constraint';
import { Particle } from './Particle';
import { PhysicalObject } from './Physical';
import type { PhysicsEngine } from './PhysicsEngine';

export type ParticleFactory = (position: Vec) => Particle;

/**
 * Utility for emitting new particles at a configurable rate.
 */
export class ParticleEmitter implements PhysicalObject {
	position: Vec;
	rate: number;
	private readonly factory: ParticleFactory;
	private accumulator = 0;
	isEmitting = true;

	constructor(position: Vec, rate: number, factory: ParticleFactory) {
		this.position = new Vec(position);
		this.rate = rate;
		this.factory = factory;
	}

	setPosition(position: Vec): void {
		this.position.set(position);
	}

	setRate(rate: number): void {
		this.rate = rate;
	}

	emit(): Particle {
		return this.factory(new Vec(this.position));
	}

	/**
	 * Update the emitter and emit particles into the physics engine.
	 * @param engine Target engine that receives new particles.
	 * @param deltaTime Time step multiplier (1 = one frame).
	 */
	update(engine: PhysicsEngine, deltaTime = 1): void {
		if (!this.isEmitting) return;
		this.accumulator += this.rate * deltaTime;
		while (this.accumulator >= 1) {
			const particle = this.emit();
			engine.addParticle(particle);
			this.accumulator -= 1;
		}
	}

	addConstraint(constraint: Constraint) {}

	removeConstraint(constraint: Constraint) {}
}
