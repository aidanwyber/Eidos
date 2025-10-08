import type { Constraint } from './constraints/Constraint';

export interface PhysicalObject {
	constraints: Constraint[];
	addConstraint: (constraint: Constraint) => PhysicalObject;
	removeConstraint: (constraint: Constraint) => PhysicalObject;
	clearConstraints: () => PhysicalObject;
}
