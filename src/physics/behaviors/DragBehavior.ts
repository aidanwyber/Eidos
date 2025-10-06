import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

/**
 * Applies a quadratic drag force opposite to the particle's velocity.
 */
export class DragBehavior implements Behavior {
	private readonly coefficient: number;

	constructor(coefficient: number) {
		this.coefficient = coefficient;
	}

	applyBehavior(p: Particle): void {
		if (p.isLocked) return;

		const velocity = p.getVelocity();
		const speedSq = velocity.magSq();

		if (speedSq === 0) return;

		p.addForce(velocity.normalizeTo(-this.coefficient * speedSq));
	}
}
