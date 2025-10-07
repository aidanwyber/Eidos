import { Rect } from '../geom';
import { Vec } from '../geom/Vec';
import type { Behavior } from './behaviors';
import type { Constraint } from './constraints/Constraint';
import type { PhysicalObject } from './Physical';
import type { Spring } from './Spring';

export class Particle extends Vec implements PhysicalObject {
	prev: Vec;
	temp: Vec;
	force: Vec;

	mass!: number;
	inverseMass!: number;

	radius: number;

	isLocked: boolean;

	hasLifespan = false;
	lifespan: number = 255;

	hasTrail: boolean = false;
	trail = [];
	trailLength: number = 10;

	springs: Spring[] = [];

	behaviors: Behavior[] = [];
	constraints: Constraint[] = [];

	positionCallback?: () => Vec;

	constructor(pos: Vec, radius?: number, mass = 1, isLocked = false) {
		super(pos);
		this.prev = this.copy();
		this.temp = new Vec(0, 0);
		this.force = new Vec(0, 0);
		this.radius = radius ?? 10;
		// this.setMass(Math.pow(this.radius, 2) * 0.1);
		this.setMass(mass);
		this.isLocked = isLocked;
	}

	setMass(m: number) {
		this.mass = m;
		this.inverseMass = this.mass !== 0 ? 1 / this.mass : 0;
	}

	addForce(v: Vec): Particle {
		this.force.addSelf(v);
		return this;
	}

	clearForce(): Particle {
		this.force.set(0, 0);
		return this;
	}

	addVelocity(deltaVel: Vec): Particle {
		this.prev.subSelf(deltaVel);
		return this;
	}

	clearVelocity(): Particle {
		this.prev.set(this);
		return this;
	}

	getVelocity(): Vec {
		return this.sub(this.prev);
	}

	setVelocity(vel: Vec): Particle {
		this.addVelocity(this.getVelocity().scale(-1).add(vel));
		return this;
	}

	dampen(gamma: number): Particle {
		this.addVelocity(this.getVelocity().scale(1 - gamma));
		return this;
	}

	lock(positionCallback?: () => Vec): Particle {
		this.isLocked = true;
		if (positionCallback) {
			this.positionCallback = positionCallback;
		}
		return this;
	}

	unlock(): Particle {
		this.clearVelocity();
		this.isLocked = false;
		return this;
	}

	addBehavior(behavior: Behavior): Particle {
		this.behaviors.push(behavior);
		return this;
	}

	addConstraint(constraint: Constraint): Particle {
		this.constraints.push(constraint);
		return this;
	}

	applyBehaviors(): Particle {
		for (let behavior of this.behaviors) {
			behavior.applyBehavior(this);
		}
		return this;
	}

	applyConstraints(): Particle {
		for (let constraint of this.constraints) {
			constraint.applyConstraint(this);
		}
		return this;
	}

	removeAllBehaviors(): Particle {
		this.behaviors = [];
		return this;
	}

	removeAllConstraints(): Particle {
		this.constraints = [];
		return this;
	}

	removeBehavior(behavior: Behavior): Particle {
		this.behaviors.splice(this.behaviors.indexOf(behavior), 1);
		return this;
	}

	removeConstraint(constraint: Constraint): Particle {
		this.constraints.splice(this.constraints.indexOf(constraint), 1);
		return this;
	}

	update() {
		if (this.isLocked) {
			if (this.positionCallback) {
				this.set(this.positionCallback());
			}
			return;
		}

		this.applyBehaviors();

		this.temp.set(this);

		this.addSelf(this.sub(this.prev).add(this.force.scale(this.mass)));

		this.prev.set(this.temp);
		this.clearForce();

		this.applyConstraints();
	}

	// draw() {
	// 	fill(0, this.lifespan);
	// 	noStroke();
	// 	circle(this.x, this.y, this.radius * 2);

	// 	if (this.isHovered()) {
	// 		console.log('hovered!');
	// 		stroke(0, this.lifespan);
	// 		noFill();
	// 		circle(this.x, this.y, this.radius * 4);
	// 	}

	// 	if (this.hasTrail) {
	// 		noFill();
	// 		stroke(255, this.lifespan);
	// 		beginShape();
	// 		for (let p of this.trail) {
	// 			vertex(p.x, p.y);
	// 		}
	// 		endShape();
	// 	}
	// }

	addSpring(spring: Spring): Particle {
		this.springs.push(spring);
		return this;
	}

	// isHovered(): boolean {
	// 	return (
	// 		this.distanceToSq(new Vec(mouseX, mouseY)) <
	// 		this.radius * this.radius
	// 	);
	// }
}
