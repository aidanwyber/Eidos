import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

/**
 * Applies static and kinetic friction to reduce particle velocity.
 */
export class FrictionBehavior implements Behavior {
        private readonly staticCoefficient: number;
        private readonly kineticCoefficient: number;

        constructor(staticCoefficient: number, kineticCoefficient: number) {
                this.staticCoefficient = staticCoefficient;
                this.kineticCoefficient = kineticCoefficient;
        }

        applyBehavior(p: Particle): void {
                if (p.isLocked) return;

                const velocity = p.getVelocity();
                const speed = velocity.mag();
                if (speed === 0) return;

                if (speed < this.staticCoefficient) {
                        p.clearVelocity();
                        return;
                }

                const friction = velocity.normalizeTo(-this.kineticCoefficient);
                p.addForce(friction);
        }
}
