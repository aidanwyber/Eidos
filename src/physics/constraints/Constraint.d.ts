import type { Particle } from '../Particle';

export interface Constraint {
	applyConstraint(particle: Particle);
}
