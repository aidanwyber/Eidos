# Eidos

⚠️ Construction still in progress!

Eidos is a JavaScript & TypeScript library for creative-coding with p5.js. It provides geometry utilities and a physics engine that built on the foundations of [toxiclibsjs](https://github.com/hapticdata/toxiclibsjs), modified and extended for modern TypeScript. At the core is a Verlet physics system with p5.js rendering helpers.

Eidos refers to Plato's form (εἶδος), an idea with a functional structure. Isn't that exactly what a simulation is?

## Features

### Geometry primitives

-   `Vec` for 2D vector math with both pure and mutating helpers.
-   `Circle`, `Line`, and `Rect` types with distance and intersection utilities.

### Physics system (powered by toxiclibsjs)

-   `PhysicsEngine` extends toxiclibsjs's VerletPhysics2D with additional features like configurable gravity, friction, drag, damping, repulsion, and mouse interaction
-   `Particle` builds on toxiclibsjs's VerletParticle2D implementation with enhanced TypeScript typing
-   Structural components including `Spring`, `SpringChain`, `ParticleEmitter`, and `ParticleSink`
-   Behavior system (`AttractBehavior`, `BounceBehavior`, `DragBehavior`, etc.) derived from toxiclibsjs's behavior pipeline

### Graphics helpers

-   `GFX` provides a typed wrapper around p5.js for rendering particles, springs, vectors, and common geometric primitives
-   Includes helper methods for arrows, polygons, curves, grids, and text with both vector and coordinate-based overloads

## Installation

<del>To use Eidos in your own project:</del>

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

Check out the [`examples/`](examples) directory for focused demonstrations of the physics system, including particle emitters, spring chains, and various behaviors. Each example imports from the published package and can be adapted for your preferred build setup.

## Credits

The physics system in Eidos is a direct TypeScript adaptation of [toxiclibsjs](https://github.com/hapticdata/toxiclibsjs) by Kyle Phillips, which itself is based on Karsten Schmidt's original [toxiclibs](http://toxiclibs.org/) for Processing. We're grateful to both projects for establishing the robust foundation that Eidos builds upon.

## Building the package

The build output is generated with [`tsup`](https://tsup.egoist.dev). To regenerate the distributable files:

```bash
npm run build
```

This produces CommonJS, ESM, and TypeScript declaration bundles in `dist/` that align with the `package.json` exports map.
