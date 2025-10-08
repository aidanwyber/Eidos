import type { Constraint } from './Constraint';
import type { Particle } from '../Particle';
import { Vec } from '../../geom/Vec';

export class CircularConstraint implements Constraint {
	private center: Vec;
	private radius: number;

	constructor(center: Vec, radius: number) {
		this.center = center;
		this.radius = radius;
	}

	applyConstraint(particle: Particle): void {
		const diff = particle.sub(this.center);
		const maxDist = this.radius - particle.radius;

		if (diff.magSq() < maxDist * maxDist) return;

		particle.set(this.center.add(diff.normalize().scale(maxDist)));
	}
}
