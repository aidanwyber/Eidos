import { Vec } from '../../geom/Vec';
import { Particle } from '../Particle';
import { Behavior } from './Behavior';

/**
 * DynamicForceBehavior applies a force to each particle using a user-supplied function.
 * The function receives the particle and should return a Vec representing the force to apply.
 */
export class DynamicForceBehavior implements Behavior {
	readonly forceFn: (p: Particle) => Vec;

	constructor(forceFn: (p: Particle) => Vec) {
		this.forceFn = forceFn;
	}

	applyBehavior(particle: Particle): void {
		const force = this.forceFn(particle);
		particle.addForce(force);
	}
}
