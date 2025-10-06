import { Rect, Vec } from '../geom/index';
import { Constraint } from './constraints/Constraint';
import {
	Behavior,
	DragBehavior,
	GravityBehavior,
	Particle,
	Spring,
	SpringChain,
} from './index';
import type { Physical } from './Physical';

export class PhysicsEngine {
	iters;
	timeStep;

	worldBounds: Rect | undefined;

	particles: Particle[] = [];
	behaviors: Behavior[] = [];

	springs: Spring[] = [];

	constructor(iters = 50, timeStep = 1, doDefaultSetup = true) {
		this.iters = iters;
		this.timeStep = timeStep;

		if (!doDefaultSetup) return;

		this.addBehavior(new DragBehavior(0.02));
		this.addBehavior(new GravityBehavior(new Vec(0, -0.1)));
	}

	addConstraintToAll(constraint: Constraint, list: Physical[]) {
		for (let item of list) {
			item.addConstraint(constraint);
		}
	}

	removeConstraintFromAll(constraint: Constraint, list: Physical[]) {
		for (let item of list) {
			item.removeConstraint(constraint);
		}
	}

	addBehavior(behavior: Behavior): PhysicsEngine {
		if (this.behaviors.indexOf(behavior) > -1) return this;
		this.behaviors.push(behavior);
		return this;
	}

	addParticle(p: Particle): PhysicsEngine {
		if (this.particles.indexOf(p) > -1) return this;
		this.particles.push(p);
		return this;
	}

	addSpring(spring: Spring): PhysicsEngine {
		if (this.springs.indexOf(spring) > -1) return this;
		this.springs.push(spring);
		this.addParticle(spring.a);
		this.addParticle(spring.b);
		return this;
	}

	addSpringChain(springChain: SpringChain): PhysicsEngine {
		for (let spring of springChain.springs) {
			this.addSpring(spring);
		}
		return this;
	}

	removeBehavior(behavior: Behavior): PhysicsEngine {
		this.behaviors.splice(this.behaviors.indexOf(behavior), 1);
		return this;
	}

	removeParticle(particle: Particle): PhysicsEngine {
		this.particles.splice(this.particles.indexOf(particle), 1);
		return this;
	}

	removeSpring(spring: Spring): PhysicsEngine {
		this.springs.splice(this.springs.indexOf(spring), 1);
		return this;
	}

	clear() {
		this.particles = [];
		this.springs = [];
		return this;
	}

	setWorldBounds(bounds: Rect): PhysicsEngine {
		this.worldBounds = bounds;
		return this;
	}

	updateParticles(): PhysicsEngine {
		for (let behavior of this.behaviors) {
			for (let particle of this.particles) {
				behavior.applyBehavior(particle);
			}
		}

		for (let particle of this.particles) {
			particle.update();
		}

		// if (
		// 	this.hasMouseInteraction &&
		// 	this.heldParticleIndex !== null &&
		// 	this.isMouseDown
		// ) {
		// 	const pHeld = this.particles[this.heldParticleIndex];
		// 	pHeld?.set(this.mouse);
		// 	pHeld?.clearVelocity();
		// }
		return this;
	}

	updateSprings(): PhysicsEngine {
		for (let i = 0; i < this.iters; i++) {
			for (let spring of this.springs) {
				spring.update();
			}
		}
		return this;
	}

	constrainToBounds(): PhysicsEngine {
		if (!this.worldBounds) return this;

		for (let particle of this.particles) {
			particle.constrain(this.worldBounds);
		}
		return this;
	}

	update(): PhysicsEngine {
		this.updateParticles();
		this.updateSprings();
		this.constrainToBounds();
		return this;
	}
}
