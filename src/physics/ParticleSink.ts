import { Vec } from '../geom/Vec';
import type { Particle } from './Particle';
import type { PhysicsEngine } from './PhysicsEngine';

/**
 * Removes particles that enter a given radius around the sink position.
 */
export class ParticleSink {
        position: Vec;
        radius: number;

        constructor(position: Vec, radius: number) {
                this.position = new Vec(position);
                this.radius = radius;
        }

        setPosition(position: Vec): void {
                this.position.set(position);
        }

        setRadius(radius: number): void {
                this.radius = radius;
        }

        contains(p: Particle): boolean {
                return p.distanceToSq(this.position) <= this.radius * this.radius;
        }

        absorb(engine: PhysicsEngine): void {
                const remaining: Particle[] = [];
                for (const particle of engine.particles) {
                        if (!this.contains(particle)) {
                                remaining.push(particle);
                        }
                }
                engine.particles = remaining;
        }
}
