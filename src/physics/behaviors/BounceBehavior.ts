import { Vec } from '../../geom/Vec';
import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';

export interface BounceRect {
        x: number;
        y: number;
        width: number;
        height: number;
}

/**
 * Keeps particles within a rectangular region, reflecting their velocity when they hit the bounds.
 */
export class BounceBehavior implements Behavior {
        private readonly bounds: BounceRect;
        private readonly restitution: number;

        constructor(bounds: BounceRect, restitution = 1) {
                this.bounds = { ...bounds };
                this.restitution = restitution;
        }

        applyBehavior(p: Particle): void {
                if (p.isLocked) return;

                const left = this.bounds.x + p.radius;
                const right = this.bounds.x + this.bounds.width - p.radius;
                const top = this.bounds.y + p.radius;
                const bottom = this.bounds.y + this.bounds.height - p.radius;

                let velocity = p.getVelocity();
                let bounced = false;

                if (p.x < left) {
                        p.x = left;
                        velocity = new Vec(-velocity.x * this.restitution, velocity.y);
                        bounced = true;
                } else if (p.x > right) {
                        p.x = right;
                        velocity = new Vec(-velocity.x * this.restitution, velocity.y);
                        bounced = true;
                }

                if (p.y < top) {
                        p.y = top;
                        velocity = new Vec(velocity.x, -velocity.y * this.restitution);
                        bounced = true;
                } else if (p.y > bottom) {
                        p.y = bottom;
                        velocity = new Vec(velocity.x, -velocity.y * this.restitution);
                        bounced = true;
                }

                if (bounced) {
                        p.setVelocity(velocity);
                }
        }
}
