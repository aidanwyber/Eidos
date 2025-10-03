import { Vec } from '../geom/Vec';
import { Spring } from './Spring';
export class Particle extends Vec {
    prev;
    temp;
    force;
    mass;
    radius = 10;
    isLocked;
    hasLifespan = false;
    lifespan = 255;
    hasTrail = false;
    trail = [];
    trailLength = 10;
    springs = [];
    // behaviors;
    constructor(pos, mass = 1, isLocked = false) {
        super(pos);
        this.prev = this.copy();
        this.temp = new Vec(0, 0);
        this.force = new Vec(0, 0);
        this.mass = mass;
        this.isLocked = isLocked;
        // this.x += (Math.random() * 2 - 1) * 1e-3;
        // this.y += (Math.random() * 2 - 1) * 1e-3;
    }
    addForce(v) {
        this.force.addSelf(v);
    }
    clearForce() {
        this.force.set(0, 0);
    }
    // applyBehaviors() {
    // 	for (let behavior of this.behaviors) {
    // 		behavior.applyBehavior(this);
    // 	}
    // }
    addVelocity(deltaVel) {
        this.prev.subSelf(deltaVel);
    }
    clearVelocity() {
        this.prev.set(this);
    }
    getVelocity() {
        return this.sub(this.prev);
    }
    setVelocity(vel) {
        this.addVelocity(this.getVelocity().scale(-1).add(vel));
    }
    dampen(gamma) {
        this.addVelocity(this.getVelocity().scale(1 - gamma));
    }
    update() {
        if (this.isLocked)
            return;
        // this.applyBehaviors();
        this.temp.set(this);
        this.addSelf(this.sub(this.prev).addSelf(this.force.scale(this.mass)));
        this.prev.set(this.temp);
        this.clearForce();
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
    addSpring(spring) {
        this.springs.push(spring);
    }
}
//# sourceMappingURL=Particle.js.map