import type { Vec } from '../geom/Vec';
import { PhysicsEngine, Particle } from './index';
export declare class SpringChain {
    particles: Particle[];
    constructor(physics: PhysicsEngine, firstParticle: Particle, dir: Vec, length: number, segmentCount: number, k: number);
}
//# sourceMappingURL=SpringChain.d.ts.map