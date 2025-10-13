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
import type { PhysicalObject } from './PhysicalObject';

export class PhysicsEngine {
	iters;
	timeStep;

	particles: Particle[] = [];
	behaviors: Behavior[] = [];

	springs: Spring[] = [];

	worldBounds?: Rect;

	constructor(iters = 50, timeStep = 1, doDefaultSetup = true) {
		this.iters = iters;
		this.timeStep = timeStep;

		if (!doDefaultSetup) return;

		this.addBehavior(new DragBehavior(0.02));
		this.addBehavior(new GravityBehavior(new Vec(0, -0.1)));
	}

	addConstraintToAll(constraint: Constraint, list: PhysicalObject[]) {
		for (let item of list) {
			item.addConstraint(constraint);
		}
	}

	removeConstraintFromAll(constraint: Constraint, list: PhysicalObject[]) {
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

	removeSpringChain(springChain: SpringChain): PhysicsEngine {
		for (let spring of springChain.springs) this.removeSpring(spring);
		for (let particle of springChain.particles)
			this.removeParticle(particle);
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

	update(): void {
		this.updateParticles();
		this.updateSprings();
		this.constrainToBounds();
	}

	updateParticles(): void {
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
	}

	updateSprings(): void {
		for (let i = 0; i < this.iters; i++) {
			const doApplyConstraints = i === this.iters - 1;

			for (let spring of this.springs) {
				spring.update(doApplyConstraints);
			}
		}
	}

	constrainToBounds(): void {
		if (!this.worldBounds) return;

		for (let particle of this.particles) {
			particle.constrainSelf(this.worldBounds.shrink(particle.radius));
		}
	}
}
