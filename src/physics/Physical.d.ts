import type { Constraint } from './constraints/Constraint';

export interface Physical {
	addConstraint(constraint: Constraint);
	removeConstraint(constraint: Constraint);
}
