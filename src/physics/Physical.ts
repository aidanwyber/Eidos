import type { Constraint } from './constraints/Constraint';

export interface Physical {
	addConstraint: (constraint: Constraint) => void;
	removeConstraint: (constraint: Constraint) => void;
}
