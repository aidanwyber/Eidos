import { Rect } from '../geom';
import { Vec } from '../geom/Vec';
import type { Behavior } from './behaviors';
import type { Constraint } from './constraints/Constraint';
import type { Physical } from './Physical';
import type { Spring } from './Spring';

export class Particle extends Vec implements Physical {
	prev: Vec;
	temp: Vec;
	force: Vec;

	mass: number;
	radius: number = 10;

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

	constructor(pos: Vec, mass = 1, isLocked = false) {
		super(pos);
		this.prev = this.copy();
		this.temp = new Vec(0, 0);
		this.force = new Vec(0, 0);
		this.mass = mass;
		this.isLocked = isLocked;
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

	constrain(bounds: Rect) {
		if (this.x < bounds.a.x + this.radius) {
			this.x = bounds.a.x + this.radius;
			this.setVelocity(new Vec(0, this.getVelocity().y));
		}
		if (this.x > bounds.b.x - this.radius) {
			this.x = bounds.b.x - this.radius;
			this.setVelocity(new Vec(0, this.getVelocity().y));
		}
		if (this.y < bounds.a.y + this.radius) {
			this.y = bounds.a.y + this.radius;
			this.setVelocity(new Vec(this.getVelocity().x, 0));
		}
		if (this.y > bounds.b.y - this.radius) {
			this.y = bounds.b.y - this.radius;
			this.setVelocity(new Vec(this.getVelocity().x, 0));
		}
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
		this.addSelf(this.sub(this.prev).addSelf(this.force.scale(this.mass)));
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
