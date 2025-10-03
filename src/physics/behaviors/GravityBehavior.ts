import type { Vec } from '../../geom/Vec';
import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

export class GravityBehavior implements Behavior {
	acc: Vec;

	constructor(acc: Vec) {
		this.acc = acc;
	}

	applyBehavior(p: Particle) {
		p.addForce(this.acc.div(p.mass));
	}
}
