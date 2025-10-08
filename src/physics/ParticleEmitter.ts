import { Vec } from '../geom/Vec';
import { Particle } from './Particle';
import type { PhysicsEngine } from './PhysicsEngine';

/**
 * Utility for emitting new particles at a configurable rate.
 */
export class ParticleEmitter extends Particle {
	physics: PhysicsEngine;
	speed: number;
	rate: number;
	private accumulator = 0;
	isEmitting = true;

	constructor(
		physics: PhysicsEngine,
		position: Vec,
		speed: number,
		rate: number
	) {
		super(position);
		this.physics = physics;
		this.speed = speed;
		this.rate = rate;
		this.lock();
	}

	emit(): Particle {
		const p = new Particle(this.copy());
		p.setVelocity(Vec.random2D());
		return p;
	}

	/**
	 * Update the emitter and emit particles into the physics engine.
	 * @param physics Target engine that receives new particles.
	 * @param deltaTime Time step multiplier (1 = one frame).
	 */
	update(): void {
		if (!this.isEmitting) return;
		this.accumulator += this.rate * this.physics.timeStep;
		while (this.accumulator >= 1) {
			this.physics.addParticle(this.emit());
			this.accumulator -= 1;
		}
	}
}
