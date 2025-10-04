import p5 from 'p5';

declare class Vec {
    x: number;
    y: number;
    constructor(x: Vec | number, y?: number);
    set(x: Vec | number, y?: number): Vec;
    add(v: Vec): Vec;
    addSelf(v: Vec): Vec;
    sub(v: Vec): Vec;
    subSelf(v: Vec): Vec;
    scale(s: number): Vec;
    scaleSelf(s: number): Vec;
    div(s: number): Vec;
    divSelf(s: number): Vec;
    dot(v: Vec): number;
    magSq(): number;
    mag(): number;
    normalize(): Vec;
    normalizeSelf(): Vec;
    normalizeTo(len: number): Vec;
    normalizeToSelf(len: number): Vec;
    distanceToSq(v: Vec): number;
    distanceTo(v: Vec): number;
    perp(): Vec;
    perpSelf(): Vec;
    rotate(theta: number): Vec;
    rotateSelf(theta: number): Vec;
    lerp(v: Vec, t: number): Vec;
    lerpSelf(v: Vec, t: number): Vec;
    angleTo(v: Vec): number;
    angle(): number;
    copy(): Vec;
    toString(): string;
    projectOnto(v: Vec): Vec;
    projectOntoSelf(v: Vec): Vec;
    static epsilon: number;
    static random2D(): Vec;
    static fromAngle(angle: number): Vec;
    static get ZERO(): Vec;
    static get X(): Vec;
    static get Y(): Vec;
    static angleBetween(a: Vec, b: Vec): number;
    static angleFromTo(a: Vec, b: Vec): number;
}

declare class Spring {
    a: Particle;
    b: Particle;
    restLength: number;
    k: number;
    damping: number;
    static epsilon: number;
    constructor(a: Particle, b: Particle, restLength: number, k: number);
    apply(): void;
}

declare class Particle extends Vec {
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

declare class Circle extends Vec {
    radius: number;
    constructor(center: Vec, radius: number);
    distanceToPoint(pt: Vec): number;
    distanceToCircle(c: Circle): number;
}

declare class Line {
    a: Vec;
    b: Vec;
    constructor(a: Vec, b: Vec);
    getHeading(): Vec;
    getDir(): Vec;
    getLength(): number;
    getMidpoint(): Vec;
    copy(): Line;
    toString(): string;
    intersectLine(line: Line): Vec | null;
    intersectCircle(circle: Circle): Vec[];
    static fromAngleLength(angle: number, length: number, origin?: Vec): Line;
}

declare class Rect {
    a: Vec;
    b: Vec;
    constructor(x: number, y: number, width: number, height: number);
    constructor(a: Vec, b: Vec);
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    get area(): number;
    containsPoint(p: Vec): boolean;
    getCenter(): Vec;
    copy(): Rect;
    translate(dx: number, dy: number): Rect;
    intersects(other: Rect): boolean;
    union(other: Rect): Rect;
    intersection(other: Rect): Rect | null;
}

declare class PhysicsEngine {
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

type ParticleFactory = (position: Vec) => Particle;
/**
 * Utility for emitting new particles at a configurable rate.
 */
declare class ParticleEmitter {
    position: Vec;
    rate: number;
    private readonly factory;
    private accumulator;
    isEmitting: boolean;
    constructor(position: Vec, rate: number, factory: ParticleFactory);
    setPosition(position: Vec): void;
    setRate(rate: number): void;
    emit(): Particle;
    /**
     * Update the emitter and emit particles into the physics engine.
     * @param engine Target engine that receives new particles.
     * @param deltaTime Time step multiplier (1 = one frame).
     */
    update(engine: PhysicsEngine, deltaTime?: number): void;
}

/**
 * Removes particles that enter a given radius around the sink position.
 */
declare class ParticleSink {
    position: Vec;
    radius: number;
    constructor(position: Vec, radius: number);
    setPosition(position: Vec): void;
    setRadius(radius: number): void;
    contains(p: Particle): boolean;
    absorb(engine: PhysicsEngine): void;
}

declare class SpringChain {
    particles: Particle[];
    constructor(physics: PhysicsEngine, firstParticle: Particle, dir: Vec, length: number, segmentCount: number, k: number);
}

interface Behavior {
    applyBehavior: (p: Particle) => void;
}

/**
 * Attracts a particle toward a target particle with an inverse-square falloff.
 */
declare class AttractBehavior implements Behavior {
    private readonly target;
    private readonly strength;
    private readonly radiusSq;
    private readonly minDistanceSq;
    constructor(target: Particle, strength: number, radius?: number, minDistance?: number);
    applyBehavior(p: Particle): void;
}

interface BounceRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Keeps particles within a rectangular region, reflecting their velocity when they hit the bounds.
 */
declare class BounceBehavior implements Behavior {
    private readonly bounds;
    private readonly restitution;
    constructor(bounds: BounceRect, restitution?: number);
    applyBehavior(p: Particle): void;
}

/**
 * Applies a constant force (or acceleration) to the particle each update.
 */
declare class ConstantForceBehavior implements Behavior {
    private readonly force;
    constructor(force: Vec);
    applyBehavior(p: Particle): void;
}

/**
 * Applies a quadratic drag force opposite to the particle's velocity.
 */
declare class DragBehavior implements Behavior {
    private readonly coefficient;
    constructor(coefficient: number);
    applyBehavior(p: Particle): void;
}

/**
 * Applies static and kinetic friction to reduce particle velocity.
 */
declare class FrictionBehavior implements Behavior {
    private readonly staticCoefficient;
    private readonly kineticCoefficient;
    constructor(staticCoefficient: number, kineticCoefficient: number);
    applyBehavior(p: Particle): void;
}

/**
 * Applies pairwise Newtonian gravitation between the subject particle and a collection of other particles.
 */
declare class GravitationBehavior implements Behavior {
    private readonly gravitationalConstant;
    private readonly particles;
    constructor(gravitationalConstant: number, particles: Iterable<Particle> | (() => Iterable<Particle>));
    applyBehavior(p: Particle): void;
}

declare class GravityBehavior implements Behavior {
    acc: Vec;
    constructor(acc: Vec);
    applyBehavior(p: Particle): void;
}

/**
 * Applies a small random force to produce jittering motion.
 */
declare class JitterBehavior implements Behavior {
    private readonly maxDistance;
    constructor(maxDistance: number);
    applyBehavior(p: Particle): void;
}

declare class GFX {
    private sketch;
    private defaultStrokeWeight;
    private defaultParticleSize;
    constructor(sketch: p5);
    setDefaultParticleSize(size: number): void;
    setDefaultStrokeWeight(weight: number): void;
    push(): void;
    pop(): void;
    translate(x: number, y: number): void;
    rotate(angle: number): void;
    scale(s: number): void;
    scale(x: number, y: number): void;
    particle(p: Particle, size?: number): void;
    particles(particles: Particle[], size?: number): void;
    spring(s: Spring, showRestLength?: boolean): void;
    springs(springs: Spring[], showRestLength?: boolean): void;
    vector(origin: Vec, vec: Vec, scale?: number, arrowSize?: number): void;
    arrow(from: Vec, to: Vec, arrowSize?: number): void;
    line(v1: Vec, v2: Vec): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    circle(center: Vec, radius: number): void;
    circle(x: number, y: number, radius: number): void;
    ellipse(center: Vec, width: number, height: number): void;
    ellipse(x: number, y: number, width: number, height: number): void;
    rect(topLeft: Vec, width: number, height: number): void;
    rect(x: number, y: number, width: number, height: number): void;
    point(v: Vec): void;
    point(x: number, y: number): void;
    polygon(vertices: Vec[]): void;
    polyline(vertices: Vec[]): void;
    curve(points: Vec[], tension?: number): void;
    bezier(p0: Vec, p1: Vec, p2: Vec, p3: Vec): void;
    grid(spacing: number, width: number, height: number, offsetX?: number, offsetY?: number): void;
    crosshair(center: Vec, size?: number): void;
    text(str: string, pos: Vec, align?: {
        horizontal?: 'left' | 'center' | 'right';
        vertical?: 'top' | 'center' | 'bottom';
    }): void;
}

export { AttractBehavior, type Behavior, BounceBehavior, type BounceRect, Circle, ConstantForceBehavior, DragBehavior, FrictionBehavior, GFX, GravitationBehavior, GravityBehavior, JitterBehavior, Line, Particle, ParticleEmitter, type ParticleFactory, ParticleSink, PhysicsEngine, Rect, Spring, SpringChain, Vec };
