# Eidos

Eidos is a TypeScript toolkit for building creative-coding sketches with p5.js. It combines a lightweight geometry core, a Verlet-based physics engine, and rendering helpers so you can prototype interactive systems without re-implementing the basics every time.

Eidos (εἶδος) refers to the generative form that emerges when people co-create within functional and organisational structures. The library borrows that idea by providing shared primitives—vectors, particles, forces, and drawing helpers—that teams can assemble into richer systems while keeping a common language for collaboration.

## Features

### Geometry primitives
-   `Vec` for 2D vector math with both pure and mutating helpers.
-   `Circle`, `Line`, and `Rect` types with distance and intersection utilities.

### Physics system
-   `PhysicsEngine` orchestrates particles with configurable gravity, friction, drag, damping, repulsion, mouse interaction, and boundary bouncing.
-   `Particle` implements Verlet integration with force accumulation, locking, and spring registration.
-   Structural helpers including `Spring`, `SpringChain`, `ParticleEmitter`, and `ParticleSink`.
-   Behavior interfaces (`AttractBehavior`, `BounceBehavior`, `DragBehavior`, `FrictionBehavior`, `GravityBehavior`, `GravitationBehavior`, `JitterBehavior`, `ConstantForceBehavior`) for layering additional forces.

### Graphics helpers
-   `GFX` wraps a p5 instance and offers particle/spring rendering, vector arrows, polygons, curves, grids, and text helpers with overloads for both vectors and raw coordinates.

## Installation

To use Eidos in your own project:

```bash
npm install eidos p5
```

For local development inside this repository:

```bash
npm install
npm run build
```

## Quick start with p5.js

```typescript
import p5 from 'p5';
import { PhysicsEngine, Particle, Vec, GFX } from 'eidos';

new p5(sketch => {
        let engine: PhysicsEngine;
        let gfx: GFX;
        let particle: Particle;

        sketch.setup = () => {
                sketch.createCanvas(800, 600);

                engine = new PhysicsEngine(sketch.width, sketch.height);
                engine.hasGravity = true;
                engine.gravity.set(0, 0.3);

                particle = new Particle(new Vec(sketch.width / 2, 100));
                engine.addParticle(particle);

                gfx = new GFX(sketch);
        };

        sketch.draw = () => {
                sketch.background(32);

                engine.update();

                sketch.stroke(255);
                sketch.fill(255);
                gfx.particle(particle, 12);
        };
});
```

## Additional examples

More focused sketches demonstrating emitters, chains, and behaviours live in the [`examples/`](examples) directory. Each example imports from the published entry points (`eidos`, `eidos/physics`, etc.) and can be adapted into your own tooling or bundler setup.

## Building the package

The build output is generated with [`tsup`](https://tsup.egoist.dev). Regenerate the distributable files after making changes:

```bash
npm run build
```

This command produces CommonJS, ESM, and TypeScript declaration bundles inside `dist/` that align with the `package.json` exports map.
