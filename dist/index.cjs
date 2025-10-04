"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AttractBehavior: () => AttractBehavior,
  BounceBehavior: () => BounceBehavior,
  Circle: () => Circle,
  ConstantForceBehavior: () => ConstantForceBehavior,
  DragBehavior: () => DragBehavior,
  FrictionBehavior: () => FrictionBehavior,
  GFX: () => GFX,
  GravitationBehavior: () => GravitationBehavior,
  GravityBehavior: () => GravityBehavior,
  JitterBehavior: () => JitterBehavior,
  Line: () => Line,
  Particle: () => Particle,
  ParticleEmitter: () => ParticleEmitter,
  ParticleSink: () => ParticleSink,
  PhysicsEngine: () => PhysicsEngine,
  Rect: () => Rect,
  Spring: () => Spring,
  SpringChain: () => SpringChain,
  Vec: () => Vec
});
module.exports = __toCommonJS(index_exports);

// src/geom/Vec.ts
var _Vec = class _Vec {
  constructor(x, y) {
    this.x = 0;
    this.y = 0;
    if (x instanceof _Vec) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    if (y === void 0) return;
    this.x = x;
    this.y = y;
  }
  set(x, y) {
    if (x instanceof _Vec) {
      this.x = x.x;
      this.y = x.y;
      return this;
    }
    if (y === void 0) return this;
    this.x = x;
    this.y = y;
    return this;
  }
  add(v) {
    return new _Vec(this.x + v.x, this.y + v.y);
  }
  addSelf(v) {
    this.set(this.add(v));
    return this;
  }
  sub(v) {
    return new _Vec(this.x - v.x, this.y - v.y);
  }
  subSelf(v) {
    this.set(this.sub(v));
    return this;
  }
  scale(s) {
    return new _Vec(this.x * s, this.y * s);
  }
  scaleSelf(s) {
    this.set(this.scale(s));
    return this;
  }
  div(s) {
    return new _Vec(this.x / s, this.y / s);
  }
  divSelf(s) {
    this.set(this.div(s));
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  magSq() {
    return this.dot(this);
  }
  mag() {
    return Math.sqrt(this.magSq());
  }
  normalize() {
    let m = this.mag();
    if (m > _Vec.epsilon) {
      return this.scale(1 / m);
    }
    return new _Vec(0, 0);
  }
  normalizeSelf() {
    this.set(this.normalize());
    return this;
  }
  normalizeTo(len) {
    return this.normalize().scale(len);
  }
  normalizeToSelf(len) {
    this.set(this.normalizeTo(len));
    return this;
  }
  distanceToSq(v) {
    return this.sub(v).magSq();
  }
  distanceTo(v) {
    return this.sub(v).mag();
  }
  perp() {
    return new _Vec(-this.y, this.x);
  }
  perpSelf() {
    this.set(this.perp());
    return this;
  }
  rotate(theta) {
    let cos = Math.cos(theta);
    let sin = Math.sin(theta);
    return new _Vec(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  rotateSelf(theta) {
    this.set(this.rotate(theta));
    return this;
  }
  lerp(v, t) {
    return this.scale(1 - t).add(v.scale(t));
  }
  lerpSelf(v, t) {
    this.set(this.lerp(v, t));
    return this;
  }
  angleTo(v) {
    return _Vec.angleBetween(this, v);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  copy() {
    return new _Vec(this.x, this.y);
  }
  toString() {
    return `(${this.x}, ${this.y})`;
  }
  projectOnto(v) {
    let dp = this.dot(v);
    let magSq = v.magSq();
    if (magSq === 0) return new _Vec(0, 0);
    let scalar = dp / magSq;
    return v.scale(scalar);
  }
  projectOntoSelf(v) {
    this.set(this.projectOnto(v));
    return this;
  }
  static random2D() {
    let angle = Math.random() * Math.PI * 2;
    return new _Vec(Math.cos(angle), Math.sin(angle));
  }
  static fromAngle(angle) {
    return new _Vec(Math.cos(angle), Math.sin(angle));
  }
  static get ZERO() {
    return new _Vec(0, 0);
  }
  static get X() {
    return new _Vec(1, 0);
  }
  static get Y() {
    return new _Vec(0, 1);
  }
  static angleBetween(a, b) {
    let dot = a.dot(b);
    let mags = a.mag() * b.mag();
    if (mags === 0) return 0;
    let amt = dot / mags;
    if (amt <= -1) return Math.PI;
    if (amt >= 1) return 0;
    return Math.acos(amt);
  }
  static angleFromTo(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }
};
_Vec.epsilon = 1e-4;
var Vec = _Vec;

// src/physics/Particle.ts
var Particle = class extends Vec {
  // behaviors;
  constructor(pos, mass = 1, isLocked = false) {
    super(pos);
    this.radius = 10;
    this.hasLifespan = false;
    this.lifespan = 255;
    this.hasTrail = false;
    this.trail = [];
    this.trailLength = 10;
    this.springs = [];
    this.prev = this.copy();
    this.temp = new Vec(0, 0);
    this.force = new Vec(0, 0);
    this.mass = mass;
    this.isLocked = isLocked;
  }
  addForce(v) {
    this.force.addSelf(v);
  }
  clearForce() {
    this.force.set(0, 0);
  }
  // applyBehaviors() {
  // 	for (let behavior of this.behaviors) {
  // 		behavior.applyBehavior(this);
  // 	}
  // }
  addVelocity(deltaVel) {
    this.prev.subSelf(deltaVel);
  }
  clearVelocity() {
    this.prev.set(this);
  }
  getVelocity() {
    return this.sub(this.prev);
  }
  setVelocity(vel) {
    this.addVelocity(this.getVelocity().scale(-1).add(vel));
  }
  dampen(gamma) {
    this.addVelocity(this.getVelocity().scale(1 - gamma));
  }
  update() {
    if (this.isLocked) return;
    this.temp.set(this);
    this.addSelf(this.sub(this.prev).addSelf(this.force.scale(this.mass)));
    this.prev.set(this.temp);
    this.clearForce();
  }
  // draw() {
  // 	fill(0, this.lifespan);
  // 	noStroke();
  // 	circle(this.x, this.y, this.radius * 2);
  // 	if (this.isHovered()) {
  // 		console.log('hovered!');
  // 		stroke(0, this.lifespan);
  // 		noFill();
  // 		circle(this.x, this.y, this.radius * 4);
  // 	}
  // 	if (this.hasTrail) {
  // 		noFill();
  // 		stroke(255, this.lifespan);
  // 		beginShape();
  // 		for (let p of this.trail) {
  // 			vertex(p.x, p.y);
  // 		}
  // 		endShape();
  // 	}
  // }
  addSpring(spring) {
    this.springs.push(spring);
  }
  // isHovered(): boolean {
  // 	return (
  // 		this.distanceToSq(new Vec(mouseX, mouseY)) <
  // 		this.radius * this.radius
  // 	);
  // }
};

// src/physics/ParticleEmitter.ts
var ParticleEmitter = class {
  constructor(position, rate, factory) {
    this.accumulator = 0;
    this.isEmitting = true;
    this.position = new Vec(position);
    this.rate = rate;
    this.factory = factory;
  }
  setPosition(position) {
    this.position.set(position);
  }
  setRate(rate) {
    this.rate = rate;
  }
  emit() {
    return this.factory(new Vec(this.position));
  }
  /**
   * Update the emitter and emit particles into the physics engine.
   * @param engine Target engine that receives new particles.
   * @param deltaTime Time step multiplier (1 = one frame).
   */
  update(engine, deltaTime = 1) {
    if (!this.isEmitting) return;
    this.accumulator += this.rate * deltaTime;
    while (this.accumulator >= 1) {
      const particle = this.emit();
      engine.addParticle(particle);
      this.accumulator -= 1;
    }
  }
};

// src/physics/ParticleSink.ts
var ParticleSink = class {
  constructor(position, radius) {
    this.position = new Vec(position);
    this.radius = radius;
  }
  setPosition(position) {
    this.position.set(position);
  }
  setRadius(radius) {
    this.radius = radius;
  }
  contains(p) {
    return p.distanceToSq(this.position) <= this.radius * this.radius;
  }
  absorb(engine) {
    const remaining = [];
    for (const particle of engine.particles) {
      if (!this.contains(particle)) {
        remaining.push(particle);
      }
    }
    engine.particles = remaining;
  }
};

// src/geom/Line.ts
var Line = class _Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  getHeading() {
    return this.b.sub(this.a);
  }
  getDir() {
    return this.getHeading().normalize();
  }
  getLength() {
    return this.getHeading().mag();
  }
  getMidpoint() {
    return this.a.lerp(this.b, 0.5);
  }
  copy() {
    return new _Line(this.a.copy(), this.b.copy());
  }
  toString() {
    return `Line(${this.a.toString()} -> ${this.b.toString()})`;
  }
  intersectLine(line) {
    const x1 = this.a.x;
    const y1 = this.a.y;
    const x2 = this.b.x;
    const y2 = this.b.y;
    const x3 = line.a.x;
    const y3 = line.a.y;
    const x4 = line.b.x;
    const y4 = line.b.y;
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) {
      return null;
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Vec(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }
    return null;
  }
  intersectCircle(circle) {
    const d = this.getHeading();
    const f = this.a.sub(circle);
    const a = d.magSq();
    const b = 2 * f.dot(d);
    const c = f.magSq() - circle.radius * circle.radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return [];
    }
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDiscriminant) / (2 * a);
    const t2 = (-b + sqrtDiscriminant) / (2 * a);
    const intersections = [];
    if (t1 >= 0 && t1 <= 1) {
      intersections.push(this.a.add(d.scale(t1)));
    }
    if (t2 >= 0 && t2 <= 1) {
      intersections.push(this.a.add(d.scale(t2)));
    }
    return intersections;
  }
  static fromAngleLength(angle, length, origin = new Vec(0, 0)) {
    let dir = Vec.fromAngle(angle).scale(length);
    let a = origin.copy();
    let b = origin.add(dir);
    return new _Line(a, b);
  }
};

// src/geom/Circle.ts
var Circle = class extends Vec {
  constructor(center, radius) {
    super(center);
    this.radius = radius;
  }
  distanceToPoint(pt) {
    return this.distanceTo(pt) - this.radius;
  }
  distanceToCircle(c) {
    return this.distanceTo(c) - this.radius - c.radius;
  }
};

// src/geom/Rect.ts
var Rect = class _Rect {
  constructor(arg1, arg2, arg3, arg4) {
    if (arg1 instanceof Vec && arg2 instanceof Vec) {
      this.a = arg1;
      this.b = arg2;
    } else if (typeof arg1 === "number" && typeof arg2 === "number" && typeof arg3 === "number" && typeof arg4 === "number") {
      this.a = new Vec(arg1, arg2);
      this.b = new Vec(arg1 + arg3, arg2 + arg4);
    } else {
      throw new Error("Invalid constructor arguments for Rect");
    }
  }
  get x() {
    return this.a.x;
  }
  get y() {
    return this.a.y;
  }
  get width() {
    return this.b.x - this.a.x;
  }
  get height() {
    return this.b.y - this.a.y;
  }
  get area() {
    return this.width * this.height;
  }
  containsPoint(p) {
    return p.x >= this.a.x && p.x <= this.b.x && p.y >= this.a.y && p.y <= this.b.y;
  }
  getCenter() {
    return this.a.lerp(this.b, 0.5);
  }
  copy() {
    return new _Rect(this.x, this.y, this.width, this.height);
  }
  translate(dx, dy) {
    return new _Rect(this.x + dx, this.y + dy, this.width, this.height);
  }
  intersects(other) {
    return !(other.b.x < this.a.x || other.a.x > this.b.x || other.b.y < this.a.y || other.a.y > this.b.y);
  }
  union(other) {
    const x1 = Math.min(this.a.x, other.a.x);
    const y1 = Math.min(this.a.y, other.a.y);
    const x2 = Math.max(this.b.x, other.b.x);
    const y2 = Math.max(this.b.y, other.b.y);
    return new _Rect(new Vec(x1, y1), new Vec(x2, y2));
  }
  intersection(other) {
    const x1 = Math.max(this.a.x, other.a.x);
    const y1 = Math.max(this.a.y, other.a.y);
    const x2 = Math.min(this.b.x, other.b.x);
    const y2 = Math.min(this.b.y, other.b.y);
    if (x2 >= x1 && y2 >= y1) {
      return new _Rect(new Vec(x1, y1), new Vec(x2, y2));
    }
    return null;
  }
};

// src/physics/PhysicsEngine.ts
var PhysicsEngine = class {
  constructor(width, height) {
    this.particles = [];
    this.hasGravity = false;
    this.gravity = new Vec(0, 0.1);
    this.hasWind = false;
    this.wind = new Vec(0.1, 0);
    this.hasFriction = false;
    this.frictionCoefficient = 0.1;
    this.hasDrag = false;
    this.dragCoefficient = 0;
    this.hasBounce = false;
    this.bounceCoefficient = 0.8;
    this.hasRepulsion = false;
    this.repulsionStrength = 10;
    this.repulsionRadius = 10;
    this.hasDamping = true;
    this.damping = 0.01;
    this.hasMouseInteraction = true;
    this.heldParticleIndex = null;
    this.iters = 50;
    this.timeStep = 1 / this.iters;
    this.mouse = new Vec(0, 0);
    this.isMouseDown = false;
    this.width = width;
    this.height = height;
    document.body.addEventListener("mousemove", (e) => {
      this.mouse.set(e.clientX, e.clientY);
    });
    document.body.addEventListener("mousedown", () => {
      this.isMouseDown = true;
    });
    document.body.addEventListener("mouseup", () => {
      this.isMouseDown = false;
    });
  }
  addParticle(p) {
    if (this.particles.indexOf(p) > -1) return;
    this.particles.push(p);
  }
  updateParticles() {
    for (let p of this.particles) {
      if (p.isLocked) continue;
      if (this.hasGravity) {
        p.addForce(this.gravity);
      }
      if (this.hasFriction) {
        let friction = p.getVelocity().scale(-this.frictionCoefficient);
        p.addForce(friction);
      }
      if (this.hasDrag) {
        const vel = p.getVelocity();
        let drag = vel.normalizeTo(-this.dragCoefficient * vel.magSq());
        p.addForce(drag);
      }
      if (this.hasRepulsion) {
        const rrSq = this.repulsionRadius * this.repulsionRadius;
        for (let other of this.particles) {
          if (other === p) continue;
          let dir = p.sub(other);
          let distSq = dir.magSq();
          if (distSq < rrSq && distSq > 0) {
            dir.normalizeToSelf(this.repulsionStrength / distSq);
            p.addForce(dir);
          }
        }
      }
      if (this.hasMouseInteraction && this.heldParticleIndex === null && this.isMouseDown) {
        this.heldParticleIndex = this.particles.indexOf(p);
      }
      if (p.springs !== null) {
        for (let s of p.springs) {
          s.apply();
        }
      }
    }
    for (let p of this.particles) {
      if (p.isLocked) continue;
      p.force.scaleSelf(this.timeStep);
      if (this.hasDamping) {
        p.dampen(this.damping);
      }
      p.update();
      if (this.hasBounce) {
        if (p.x < p.radius) {
          p.x = p.radius;
          const vel = p.getVelocity();
          p.setVelocity(
            new Vec(vel.x * -this.bounceCoefficient, vel.y)
          );
        } else if (p.x >= this.width - p.radius) {
          p.x = this.width - p.radius;
          const vel = p.getVelocity();
          p.setVelocity(
            new Vec(vel.x * -this.bounceCoefficient, vel.y)
          );
        }
        if (p.y < p.radius) {
          p.y = p.radius;
          const vel = p.getVelocity();
          p.setVelocity(
            new Vec(vel.x, vel.y * -this.bounceCoefficient)
          );
        } else if (p.y >= this.height - p.radius) {
          p.y = this.height - p.radius;
          const vel = p.getVelocity();
          p.setVelocity(
            new Vec(vel.x, vel.y * -this.bounceCoefficient)
          );
        }
      }
    }
    if (this.hasMouseInteraction && this.heldParticleIndex !== null && this.isMouseDown) {
      const pHeld = this.particles[this.heldParticleIndex];
      pHeld?.set(this.mouse);
      pHeld?.clearVelocity();
    }
  }
  getSprings() {
    return [];
  }
  update() {
    for (let i = 0; i < this.iters; i++) {
      this.updateParticles();
    }
  }
};

// src/physics/Spring.ts
var _Spring = class _Spring {
  constructor(a, b, restLength, k) {
    // Spring constant
    this.damping = 0.05;
    this.a = a;
    this.b = b;
    this.restLength = restLength === null ? a.distanceTo(b) : restLength;
    this.k = k;
    a.addSpring(this);
    b.addSpring(this);
  }
  apply() {
    const diff = this.b.sub(this.a);
    const dx = diff.mag() - this.restLength;
    if (Math.abs(dx) > _Spring.epsilon) {
      const force = diff.normalizeTo(this.k * -dx);
      this.a.addForce(force.scale(-0.5));
      this.b.addForce(force.scale(0.5));
    }
  }
  // draw() {
  // 	const n = Math.floor(this.b.distanceTo(this.a) * 0.2);
  // 	const delta = this.b.sub(this.a).div(n);
  // 	const deltaPerp = delta.perp();
  // 	const zig = delta.rotate(Math.PI / 4).scale(Math.SQRT2 / 2);
  // 	beginShape();
  // 	vertex(this.a.x, this.a.y);
  // 	for (let i = 1; i <= n; i++) {
  // 		const zigPos = this.a
  // 			.add(delta.scale(i - 0.5))
  // 			.add(deltaPerp.scale(i % 2 === 0 ? 1 : -1));
  // 		const nextPos = this.a.add(delta.scale(i));
  // 		vertex(zigPos.x, zigPos.y);
  // 		vertex(nextPos.x, nextPos.y);
  // 	}
  // 	endShape();
  // 	// line(this.a.x, this.a.y, this.b.x, this.b.y);
  // }
};
_Spring.epsilon = 0.01;
var Spring = _Spring;

// src/physics/SpringChain.ts
var SpringChain = class {
  constructor(physics, firstParticle, dir, length, segmentCount, k) {
    this.particles = [firstParticle];
    const segmentLength = length / segmentCount;
    const segmentVector = dir.scale(segmentLength);
    let lastParticle = firstParticle;
    physics.addParticle(firstParticle);
    for (let i = 0; i < segmentCount; i++) {
      let p = new Particle(lastParticle.add(segmentVector));
      this.particles.push(p);
      physics.addParticle(p);
      lastParticle = p;
    }
    for (let i = 0; i < this.particles.length - 1; i++) {
      let pi = this.particles[i];
      let pn = this.particles[i + 1];
      new Spring(pi, pn, segmentLength, k);
    }
  }
  // draw() {
  // 	beginShape();
  // 	for (let p of this.particles) {
  // 		vertex(p.x, p.y);
  // 	}
  // 	endShape();
  // }
};

// src/physics/behaviors/AttractBehavior.ts
var DEFAULT_MIN_DISTANCE = 1;
var AttractBehavior = class {
  constructor(target, strength, radius, minDistance = DEFAULT_MIN_DISTANCE) {
    this.target = target;
    this.strength = strength;
    this.radiusSq = radius !== void 0 ? radius * radius : Number.POSITIVE_INFINITY;
    this.minDistanceSq = Math.max(minDistance * minDistance, DEFAULT_MIN_DISTANCE * DEFAULT_MIN_DISTANCE);
  }
  applyBehavior(p) {
    if (p.isLocked) return;
    if (p === this.target) return;
    const dir = this.target.sub(p);
    const distSq = dir.magSq();
    if (distSq === 0) return;
    if (distSq > this.radiusSq) return;
    const limitedDistSq = Math.max(distSq, this.minDistanceSq);
    const forceMagnitude = this.strength / limitedDistSq;
    const force = dir.normalizeTo(forceMagnitude);
    p.addForce(force);
  }
};

// src/physics/behaviors/BounceBehavior.ts
var BounceBehavior = class {
  constructor(bounds, restitution = 1) {
    this.bounds = { ...bounds };
    this.restitution = restitution;
  }
  applyBehavior(p) {
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
};

// src/physics/behaviors/ConstantForceBehavior.ts
var ConstantForceBehavior = class {
  constructor(force) {
    this.force = new Vec(force);
  }
  applyBehavior(p) {
    if (p.isLocked) return;
    p.addForce(this.force);
  }
};

// src/physics/behaviors/DragBehavior.ts
var DragBehavior = class {
  constructor(coefficient) {
    this.coefficient = coefficient;
  }
  applyBehavior(p) {
    if (p.isLocked) return;
    const velocity = p.getVelocity();
    const speedSq = velocity.magSq();
    if (speedSq === 0) return;
    const dragMagnitude = this.coefficient * speedSq;
    const drag = velocity.normalizeTo(-dragMagnitude);
    p.addForce(drag);
  }
};

// src/physics/behaviors/FrictionBehavior.ts
var FrictionBehavior = class {
  constructor(staticCoefficient, kineticCoefficient) {
    this.staticCoefficient = staticCoefficient;
    this.kineticCoefficient = kineticCoefficient;
  }
  applyBehavior(p) {
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
};

// src/physics/behaviors/GravitationBehavior.ts
var EPSILON = 1e-6;
var GravitationBehavior = class {
  constructor(gravitationalConstant, particles) {
    this.gravitationalConstant = gravitationalConstant;
    this.particles = typeof particles === "function" ? particles : () => particles;
  }
  applyBehavior(p) {
    if (p.isLocked) return;
    for (const other of this.particles()) {
      if (other === p) continue;
      const dir = other.sub(p);
      const distSq = Math.max(dir.magSq(), EPSILON);
      const forceMagnitude = this.gravitationalConstant * p.mass * other.mass / distSq;
      const force = dir.normalizeTo(forceMagnitude);
      p.addForce(force);
    }
  }
};

// src/physics/behaviors/GravityBehavior.ts
var GravityBehavior = class {
  constructor(acc) {
    this.acc = acc;
  }
  applyBehavior(p) {
    p.addForce(this.acc.div(p.mass));
  }
};

// src/physics/behaviors/JitterBehavior.ts
var JitterBehavior = class {
  constructor(maxDistance) {
    this.maxDistance = maxDistance;
  }
  applyBehavior(p) {
    if (p.isLocked) return;
    const magnitude = Math.random() * this.maxDistance;
    const jitter = Vec.random2D().normalizeTo(magnitude);
    p.addForce(jitter);
  }
};

// src/gfx/GFX.ts
var GFX = class {
  constructor(sketch) {
    this.defaultStrokeWeight = 1;
    this.defaultParticleSize = 5;
    this.sketch = sketch;
  }
  // Configuration
  setDefaultParticleSize(size) {
    this.defaultParticleSize = size;
  }
  setDefaultStrokeWeight(weight) {
    this.defaultStrokeWeight = weight;
  }
  // Utility methods
  push() {
    this.sketch.push();
  }
  pop() {
    this.sketch.pop();
  }
  translate(x, y) {
    this.sketch.translate(x, y);
  }
  rotate(angle) {
    this.sketch.rotate(angle);
  }
  scale(x, y) {
    if (y === void 0) {
      this.sketch.scale(x);
    } else {
      this.sketch.scale(x, y);
    }
  }
  // Physics rendering
  particle(p, size) {
    const s = size ?? this.defaultParticleSize;
    this.sketch.circle(p.position.x, p.position.y, s);
  }
  particles(particles, size) {
    particles.forEach((p) => this.particle(p, size));
  }
  spring(s, showRestLength = false) {
    this.sketch.line(
      // @ts-ignore
      s.a.position.x,
      // @ts-ignore
      s.a.position.y,
      // @ts-ignore
      s.b.position.x,
      // @ts-ignore
      s.b.position.y
    );
    if (showRestLength) {
      const mid = s.a.position.copy().add(s.b.position).scale(0.5);
      const angle = Math.atan2(
        // @ts-ignore
        s.b.position.y - s.a.position.y,
        // @ts-ignore
        s.b.position.x - s.a.position.x
      );
      this.sketch.push();
      this.sketch.translate(mid.x, mid.y);
      this.sketch.rotate(angle);
      this.sketch.strokeWeight(0.5);
      this.sketch.stroke(255, 0, 0, 100);
      this.sketch.line(-s.restLength / 2, 0, s.restLength / 2, 0);
      this.sketch.pop();
    }
  }
  springs(springs, showRestLength = false) {
    springs.forEach((s) => this.spring(s, showRestLength));
  }
  // Vector drawing
  vector(origin, vec, scale = 1, arrowSize = 5) {
    const end = origin.copy().add(vec.copy().scale(scale));
    this.arrow(origin, end, arrowSize);
  }
  arrow(from, to, arrowSize = 5) {
    this.sketch.line(from.x, from.y, to.x, to.y);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    this.sketch.push();
    this.sketch.translate(to.x, to.y);
    this.sketch.rotate(angle);
    this.sketch.line(0, 0, -arrowSize, -arrowSize / 2);
    this.sketch.line(0, 0, -arrowSize, arrowSize / 2);
    this.sketch.pop();
  }
  line(a, b, c, d) {
    if (a instanceof Vec && b instanceof Vec) {
      this.sketch.line(a.x, a.y, b.x, b.y);
    } else if (typeof a === "number" && typeof b === "number" && c !== void 0 && d !== void 0) {
      this.sketch.line(a, b, c, d);
    }
  }
  circle(a, b, c) {
    if (a instanceof Vec) {
      this.sketch.circle(a.x, a.y, b * 2);
    } else if (typeof a === "number" && c !== void 0) {
      this.sketch.circle(a, b, c * 2);
    }
  }
  ellipse(a, b, c, d) {
    if (a instanceof Vec) {
      this.sketch.ellipse(a.x, a.y, b, c);
    } else if (typeof a === "number" && d !== void 0) {
      this.sketch.ellipse(a, b, c, d);
    }
  }
  rect(a, b, c, d) {
    if (a instanceof Vec) {
      this.sketch.rect(a.x, a.y, b, c);
    } else if (typeof a === "number" && d !== void 0) {
      this.sketch.rect(a, b, c, d);
    }
  }
  point(a, b) {
    if (a instanceof Vec) {
      this.sketch.point(a.x, a.y);
    } else if (typeof a === "number" && b !== void 0) {
      this.sketch.point(a, b);
    }
  }
  // Polygon drawing
  polygon(vertices) {
    if (vertices.length < 3) return;
    this.sketch.beginShape();
    vertices.forEach((v) => this.sketch.vertex(v.x, v.y));
    this.sketch.endShape(this.sketch.CLOSE);
  }
  polyline(vertices) {
    if (vertices.length < 2) return;
    this.sketch.beginShape();
    vertices.forEach((v) => this.sketch.vertex(v.x, v.y));
    this.sketch.endShape();
  }
  // Curves
  curve(points, tension = 0) {
    if (points.length < 4) return;
    this.sketch.curveTightness(tension);
    this.sketch.beginShape();
    points.forEach((p) => this.sketch.curveVertex(p.x, p.y));
    this.sketch.endShape();
  }
  bezier(p0, p1, p2, p3) {
    this.sketch.bezier(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }
  // Grid and guides
  grid(spacing, width, height, offsetX = 0, offsetY = 0) {
    this.sketch.push();
    this.sketch.strokeWeight(0.5);
    for (let x = offsetX % spacing; x < width; x += spacing) {
      this.sketch.line(x, 0, x, height);
    }
    for (let y = offsetY % spacing; y < height; y += spacing) {
      this.sketch.line(0, y, width, y);
    }
    this.sketch.pop();
  }
  crosshair(center, size = 10) {
    this.sketch.line(center.x - size, center.y, center.x + size, center.y);
    this.sketch.line(center.x, center.y - size, center.x, center.y + size);
  }
  // Text helpers
  text(str, pos, align) {
    if (align) {
      this.sketch.push();
      if (align.horizontal === "center")
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
      else if (align.horizontal === "right")
        this.sketch.textAlign(this.sketch.RIGHT);
      else if (align.vertical === "center")
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.CENTER);
      else if (align.vertical === "top")
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.TOP);
      else if (align.vertical === "bottom")
        this.sketch.textAlign(this.sketch.LEFT, this.sketch.BOTTOM);
      this.sketch.text(str, pos.x, pos.y);
      this.sketch.pop();
    } else {
      this.sketch.text(str, pos.x, pos.y);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AttractBehavior,
  BounceBehavior,
  Circle,
  ConstantForceBehavior,
  DragBehavior,
  FrictionBehavior,
  GFX,
  GravitationBehavior,
  GravityBehavior,
  JitterBehavior,
  Line,
  Particle,
  ParticleEmitter,
  ParticleSink,
  PhysicsEngine,
  Rect,
  Spring,
  SpringChain,
  Vec
});
