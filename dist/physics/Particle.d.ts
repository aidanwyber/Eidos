import { Vec } from '../geom/Vec';
import { Spring } from './Spring';
export declare class Particle extends Vec {
    prev: Vec;
    temp: Vec;
    force: Vec;
    mass: number;
    radius: number;
    isLocked: boolean;
    hasLifespan: boolean;
    lifespan: number;
    hasTrail: boolean;
    trail: never[];
    trailLength: number;
    springs: Spring[];
    constructor(pos: Vec, mass?: number, isLocked?: boolean);
    addForce(v: Vec): void;
    clearForce(): void;
    addVelocity(deltaVel: Vec): void;
    clearVelocity(): void;
    getVelocity(): Vec;
    setVelocity(vel: Vec): void;
    dampen(gamma: number): void;
    update(): void;
    addSpring(spring: Spring): void;
}
//# sourceMappingURL=Particle.d.ts.map