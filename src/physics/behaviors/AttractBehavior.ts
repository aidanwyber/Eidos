import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

const DEFAULT_MIN_DISTANCE = 1;

/**
 * Attracts a particle toward a target particle with an inverse-square falloff.
 */
export class AttractBehavior implements Behavior {
        private readonly target: Particle;
        private readonly strength: number;
        private readonly radiusSq: number;
        private readonly minDistanceSq: number;

        constructor(target: Particle, strength: number, radius?: number, minDistance = DEFAULT_MIN_DISTANCE) {
                this.target = target;
                this.strength = strength;
                this.radiusSq = radius !== undefined ? radius * radius : Number.POSITIVE_INFINITY;
                this.minDistanceSq = Math.max(minDistance * minDistance, DEFAULT_MIN_DISTANCE * DEFAULT_MIN_DISTANCE);
        }

        applyBehavior(p: Particle): void {
                if (p.isLocked) return;
                if (p === this.target) return;

                const dir = this.target.sub(p);
                const distSq = dir.magSq();
                if (distSq === 0) return;

                if (distSq > this.radiusSq) return;

                const limitedDistSq = Math.max(distSq, this.minDistanceSq);
                const forceMagnitude = this.strength / limitedDistSq;
                const force = dir.normalizeTo(forceMagnitude);
                p.addForce(force);
        }
}
