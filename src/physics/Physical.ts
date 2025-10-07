import type { Constraint } from './constraints/Constraint';

export interface PhysicalObject {
	addConstraint: (constraint: Constraint) => void;
	removeConstraint: (constraint: Constraint) => void;
}
