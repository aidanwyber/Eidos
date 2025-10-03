import type { Particle } from './Particle';
export declare class Spring {
    a: Particle;
    b: Particle;
    restLength: number;
    k: number;
    damping: number;
    static epsilon: number;
    constructor(a: Particle, b: Particle, restLength: number, k: number);
    apply(): void;
}
//# sourceMappingURL=Spring.d.ts.map