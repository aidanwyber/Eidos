import { Vec } from '../geom/index';
import { Particle } from './index';
export declare class PhysicsEngine {
    particles: Particle[];
    hasGravity: boolean;
    gravity: Vec;
    hasWind: boolean;
    wind: Vec;
    hasFriction: boolean;
    frictionCoefficient: number;
    hasDrag: boolean;
    dragCoefficient: number;
    hasBounce: boolean;
    bounceCoefficient: number;
    hasRepulsion: boolean;
    repulsionStrength: number;
    repulsionRadius: number;
    hasDamping: boolean;
    damping: number;
    hasMouseInteraction: boolean;
    heldParticleIndex: number | null;
    iters: number;
    timeStep: number;
    mouse: Vec;
    isMouseDown: boolean;
    width: number;
    height: number;
    constructor(width: number, height: number);
    addParticle(p: Particle): void;
    updateParticles(): void;
    getSprings(): never[];
    update(): void;
}
//# sourceMappingURL=PhysicsEngine.d.ts.map