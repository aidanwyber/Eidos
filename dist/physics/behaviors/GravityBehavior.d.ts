import type { Vec } from '../../geom/Vec';
import type { Particle } from '../Particle';
import type { Behavior } from './Behavior';
export declare class GravityBehavior implements Behavior {
    acc: Vec;
    constructor(acc: Vec);
    applyBehavior(p: Particle): void;
}
//# sourceMappingURL=GravityBehavior.d.ts.map