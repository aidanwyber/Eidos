import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

const EPSILON = 1e-6;

/**
 * Applies pairwise Newtonian gravitation between the subject particle and a collection of other particles.
 */
export class GravitationBehavior implements Behavior {
        private readonly gravitationalConstant: number;
        private readonly particles: () => Iterable<Particle>;

        constructor(gravitationalConstant: number, particles: Iterable<Particle> | (() => Iterable<Particle>)) {
                this.gravitationalConstant = gravitationalConstant;
                this.particles = typeof particles === 'function' ? particles : () => particles;
        }

        applyBehavior(p: Particle): void {
                if (p.isLocked) return;

                for (const other of this.particles()) {
                        if (other === p) continue;

                        const dir = other.sub(p);
                        const distSq = Math.max(dir.magSq(), EPSILON);
                        const forceMagnitude =
                                (this.gravitationalConstant * p.mass * other.mass) / distSq;
                        const force = dir.normalizeTo(forceMagnitude);
                        p.addForce(force);
                }
        }
}
