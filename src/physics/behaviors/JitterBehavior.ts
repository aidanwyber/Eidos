import { Vec } from '../../geom/Vec';
import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

/**
 * Applies a small random force to produce jittering motion.
 */
export class JitterBehavior implements Behavior {
        private readonly maxDistance: number;

        constructor(maxDistance: number) {
                this.maxDistance = maxDistance;
        }

        applyBehavior(p: Particle): void {
                if (p.isLocked) return;

                const magnitude = Math.random() * this.maxDistance;
                const jitter = Vec.random2D().normalizeTo(magnitude);
                p.addForce(jitter);
        }
}
