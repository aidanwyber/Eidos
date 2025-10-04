import { Vec } from '../../geom/Vec';
import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

/**
 * Applies a constant force (or acceleration) to the particle each update.
 */
export class ConstantForceBehavior implements Behavior {
        private readonly force: Vec;

        constructor(force: Vec) {
                this.force = new Vec(force);
        }

        applyBehavior(p: Particle): void {
                if (p.isLocked) return;
                p.addForce(this.force);
        }
}
