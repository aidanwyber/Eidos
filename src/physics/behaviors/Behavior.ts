import type { Particle } from '../Particle';

export interface Behavior {
	applyBehavior: (p: Particle) => void;
}
