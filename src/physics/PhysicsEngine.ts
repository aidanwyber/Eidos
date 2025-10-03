import { Vec } from '../geom/index';
import { Particle, Spring, SpringChain } from './index';

export class PhysicsEngine {
	particles: Particle[] = [];

	hasGravity = false;
	gravity = new Vec(0, 0.1);

	hasWind = false;
	wind = new Vec(0.1, 0);

	hasFriction = false;
	frictionCoefficient = 0.1;

	hasDrag = false;
	dragCoefficient = 0.0;

	hasBounce = false;
	bounceCoefficient = 0.8;

	hasRepulsion = false;
	repulsionStrength = 10;
	repulsionRadius = 10;

	hasDamping = true;
	damping = 0.01;

	hasMouseInteraction = true;
	heldParticleIndex: number | null = null;

	iters = 50;
	timeStep = 1 / this.iters;

	mouse = new Vec(0, 0);
	isMouseDown = false;

	width: number;
	height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		document.body.addEventListener('mousemove', e => {
			this.mouse.set(e.clientX, e.clientY);
		});
		document.body.addEventListener('mousedown', () => {
			this.isMouseDown = true;
		});
		document.body.addEventListener('mouseup', () => {
			this.isMouseDown = false;
		});
	}

	addParticle(p: Particle) {
		if (this.particles.indexOf(p) > -1) return;
		this.particles.push(p);
	}

	updateParticles() {
		// all accelerations first
		for (let p of this.particles) {
			if (p.isLocked) continue;

			// physics properties
			if (this.hasGravity) {
				p.addForce(this.gravity);
			}

			// if (this.hasWind) {
			// 	p.addForce(this.wind);
			// }

			if (this.hasFriction) {
				let friction = p.getVelocity().scale(-this.frictionCoefficient);
				p.addForce(friction);
			}

			if (this.hasDrag) {
				const vel = p.getVelocity();
				let drag = vel.normalizeTo(-this.dragCoefficient * vel.magSq());
				p.addForce(drag);
			}

			if (this.hasRepulsion) {
				const rrSq = this.repulsionRadius * this.repulsionRadius;
				for (let other of this.particles) {
					if (other === p) continue;

					let dir = p.sub(other);
					let distSq = dir.magSq();
					if (distSq < rrSq && distSq > 0) {
						dir.normalizeToSelf(this.repulsionStrength / distSq);
						p.addForce(dir);
					}
				}
			}

			if (
				this.hasMouseInteraction &&
				this.heldParticleIndex === null &&
				this.isMouseDown
				// && p.isHovered()
			) {
				this.heldParticleIndex = this.particles.indexOf(p);
			}

			// // particle properties
			// if (p.hasLifespan) {
			// 	p.lifespan -= 1;
			// 	if (p.lifespan <= 0) {
			// 		this.particles.splice(this.particles.indexOf(p), 1);
			// 		continue;
			// 	}
			// }

			// if (p.hasTrail) {
			// 	p.trail.push(p.copy());
			// 	if (p.trail.length > p.trailLength) {
			// 		p.trail.shift();
			// 	}
			// }

			if (p.springs !== null) {
				for (let s of p.springs) {
					s.apply();
				}
			}
		}

		// now change positions based on accelerations
		for (let p of this.particles) {
			if (p.isLocked) continue;

			p.force.scaleSelf(this.timeStep);

			if (this.hasDamping) {
				p.dampen(this.damping);
			}

			p.update();

			if (this.hasBounce) {
				if (p.x < p.radius) {
					p.x = p.radius;
					const vel = p.getVelocity();
					p.setVelocity(
						new Vec(vel.x * -this.bounceCoefficient, vel.y)
					);
				} else if (p.x >= this.width - p.radius) {
					p.x = this.width - p.radius;
					const vel = p.getVelocity();
					p.setVelocity(
						new Vec(vel.x * -this.bounceCoefficient, vel.y)
					);
				}
				if (p.y < p.radius) {
					p.y = p.radius;
					const vel = p.getVelocity();
					p.setVelocity(
						new Vec(vel.x, vel.y * -this.bounceCoefficient)
					);
				} else if (p.y >= this.height - p.radius) {
					p.y = this.height - p.radius;
					const vel = p.getVelocity();
					p.setVelocity(
						new Vec(vel.x, vel.y * -this.bounceCoefficient)
					);
				}
			}
		}

		if (
			this.hasMouseInteraction &&
			this.heldParticleIndex !== null &&
			this.isMouseDown
		) {
			const pHeld = this.particles[this.heldParticleIndex];
			pHeld?.set(this.mouse);
			pHeld?.clearVelocity();
		}
	}

	getSprings() {
		return [];
	}

	update() {
		for (let i = 0; i < this.iters; i++) {
			this.updateParticles();
		}
	}
}
