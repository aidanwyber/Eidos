# Eidos

A TypeScript geometry and physics library for p5.js, inspired by toxiclibs.js.

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Setup

```typescript
import p5 from 'p5';
import Eidos from 'eidos';
import { Particle } from 'eidos/physics';

new p5(sketch => {
	const physics = new Eidos.PhysicsEngine();
	const gfx = new Eidos.GFX(sketch);

	sketch.setup = () => {
		sketch.createCanvas(800, 600);

		// Add a particle
		const p = physics.addParticle(new Particle(100, 100));
	};

	sketch.draw = () => {
		sketch.background(255);

		// Update physics
		physics.update();

		// Draw particles
		physics.particles.forEach(particle => {
			gfx.particle(particle);
		});
	};
});
```

## Core Components

### Physics

#### Particle

Represents a point mass with position, velocity, and forces.

```typescript
const p = new Particle(x, y, mass);
p.addForce(new Vec(10, 0));
p.addVelocity(new Vec(1, 1));
p.lock(); // Lock position
p.unlock();
```

#### Spring

Connects two particles with spring forces.

```typescript
const spring = new Spring(particleA, particleB, strength, restLength);
physics.addSpring(spring);
```

#### AttractionBehavior

Applies attraction/repulsion forces between particles.

```typescript
const attractor = new Particle(400, 300, 10);
const attraction = new AttractionBehavior(attractor, radius, strength);
physics.addBehavior(attraction);
```

#### PhysicsEngine

Main engine that manages and updates all physics entities.

```typescript
const physics = new Eidos.PhysicsEngine();
physics.setGravity(0, 0.5);
physics.setDrag(0.01);
physics.update();
```

### Geometry

#### Vec

2D vector with common vector operations.

```typescript
const v = new Vec(10, 20);
v.add(new Vec(5, 5));
v.normalize();
v.scale(2);
v.rotate(Math.PI / 4);
```

### Graphics

#### GFX

Helper class for rendering physics objects with p5.js.

```typescript
const gfx = new Eidos.GFX(sketch);
gfx.particle(particle, size);
gfx.spring(spring, showRestLength);
gfx.line(vec1, vec);
gfx.circle(center, radius);
gfx.arrow(from, to);
```

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build
```

## API Reference

### PhysicsEngine Methods

-   `addParticle(particle: Particle): Particle`
-   `removeParticle(particle: Particle): void`
-   `addSpring(spring: Spring): Spring`
-   `removeSpring(spring: Spring): void`
-   `addBehavior(behavior: AttractionBehavior): AttractionBehavior`
-   `removeBehavior(behavior: AttractionBehavior): void`
-   `setGravity(x: number, y: number): void`
-   `setDrag(drag: number): void`
-   `update(): void`
-   `clear(): void`

### Vec Methods

-   `copy(): Vec`
-   `set(x: number, y: number): Vec`
-   `add(v: Vec): Vec`
-   `sub(v: Vec): Vec`
-   `scale(s: number): Vec`
-   `mult(s: number): Vec`
-   `div(s: number): Vec`
-   `magnitude(): number`
-   `magSquared(): number`
-   `normalize(): Vec`
-   `limit(max: number): Vec`
-   `distanceTo(v: Vec): number`
-   `dot(v: Vec): number`
-   `rotate(angle: number): Vec`
-   `lerp(v: Vec, t: number): Vec`
-   `constrain(min: Vec, max: Vec): Vec`

### GFX Methods

-   `particle(p: Particle, size?: number): void`
-   `spring(s: Spring, showRestLength?: boolean): void`
-   `line(v1: Vec, v2: Vec): void`
-   `circle(center: Vec, radius: number): void`
-   `rect(topLeft: Vec, width: number, height: number): void`
-   `arrow(from: Vec, to: Vec, arrowSize?: number): void`
-   `vector(origin: Vec, vec: Vec, scale?: number): void`

## Examples

### Simple Gravity Simulation

```typescript
import p5 from 'p5';
import Eidos from 'eidos';
import { Particle } from 'eidos/physics';

new p5(sketch => {
	const physics = new Eidos.PhysicsEngine();
	const gfx = new Eidos.GFX(sketch);

	sketch.setup = () => {
		sketch.createCanvas(800, 600);
		physics.setGravity(0, 0.5);

		// Create particles
		for (let i = 0; i < 50; i++) {
			const x = sketch.random(sketch.width);
			const y = sketch.random(100);
			physics.addParticle(new Particle(x, y));
		}
	};

	sketch.draw = () => {
		sketch.background(255);
		physics.update();

		// Bounce particles off bottom
		physics.particles.forEach(p => {
			if (p.position.y > sketch.height) {
				p.position.y = sketch.height;
				p.velocity.y *= -0.8;
			}
		});

		sketch.fill(100, 150, 250);
		sketch.noStroke();
		physics.particles.forEach(p => gfx.particle(p, 8));
	};
});
```

### Cloth Simulation

```typescript
import p5 from 'p5';
import Eidos from 'eidos';
import { Particle, Spring } from 'eidos/physics';

new p5(sketch => {
	const physics = new Eidos.PhysicsEngine();
	const gfx = new Eidos.GFX(sketch);
	const cols = 20;
	const rows = 15;
	const spacing = 20;

	sketch.setup = () => {
		sketch.createCanvas(800, 600);
		physics.setGravity(0, 0.3);

		// Create grid of particles
		const particles: Particle[][] = [];
		for (let y = 0; y < rows; y++) {
			particles[y] = [];
			for (let x = 0; x < cols; x++) {
				const p = new Particle(
					200 + x * spacing,
					50 + y * spacing,
					0.5
				);
				particles[y][x] = p;
				physics.addParticle(p);
			}
		}

		// Lock top row
		for (let x = 0; x < cols; x++) {
			particles[0][x].lock();
		}

		// Create springs
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				// Horizontal springs
				if (x < cols - 1) {
					physics.addSpring(
						new Spring(particles[y][x], particles[y][x + 1], 0.1)
					);
				}
				// Vertical springs
				if (y < rows - 1) {
					physics.addSpring(
						new Spring(particles[y][x], particles[y + 1][x], 0.1)
					);
				}
			}
		}
	};

	sketch.draw = () => {
		sketch.background(255);
		physics.update();

		// Draw springs
		sketch.stroke(150);
		sketch.strokeWeight(1);
		physics.springs.forEach(s => gfx.spring(s));

		// Draw particles
		sketch.fill(100, 150, 250);
		sketch.noStroke();
		physics.particles.forEach(p => gfx.particle(p, 4));
	};

	sketch.mousePressed = () => {
		// Find nearest particle and pull it
		let nearest: Particle | null = null;
		let minDist = 50;

		physics.particles.forEach(p => {
			const d = p.position.distanceTo(
				new Vec(sketch.mouseX, sketch.mouseY)
			);
			if (d < minDist) {
				minDist = d;
				nearest = p;
			}
		});

		if (nearest) {
			nearest.position.set(sketch.mouseX, sketch.mouseY);
		}
	};
});
```

### Attraction/Repulsion

```typescript
import p5 from 'p5';
import Eidos from 'eidos';
import { Particle, AttractionBehavior } from 'eidos/physics';
import { Vec } from 'eidos/geom';

new p5(sketch => {
	const physics = new Eidos.PhysicsEngine();
	const gfx = new Eidos.GFX(sketch);
	let mouseAttractor: Particle;
	let attraction: AttractionBehavior;

	sketch.setup = () => {
		sketch.createCanvas(800, 600);
		physics.setGravity(0, 0);

		// Create particles with random velocities
		for (let i = 0; i < 100; i++) {
			const p = physics.addParticle(
				new Particle(
					sketch.random(sketch.width),
					sketch.random(sketch.height)
				)
			);
			p.velocity = Vec.random(2);
		}

		// Create mouse attractor
		mouseAttractor = new Particle(sketch.width / 2, sketch.height / 2, 5);
		mouseAttractor.lock();
		physics.addParticle(mouseAttractor);

		// Add attraction behavior
		attraction = new AttractionBehavior(mouseAttractor, 200, 1, 30);
		physics.addBehavior(attraction);
	};

	sketch.draw = () => {
		sketch.background(255);

		// Update mouse attractor position
		mouseAttractor.position.set(sketch.mouseX, sketch.mouseY);

		// Toggle attraction/repulsion with mouse button
		attraction.strength = sketch.mouseIsPressed ? -2 : 1;

		physics.update();

		// Wrap particles around screen
		physics.particles.forEach(p => {
			if (p === mouseAttractor) return;

			if (p.position.x < 0) p.position.x = sketch.width;
			if (p.position.x > sketch.width) p.position.x = 0;
			if (p.position.y < 0) p.position.y = sketch.height;
			if (p.position.y > sketch.height) p.position.y = 0;
		});

		// Draw particles
		sketch.fill(100, 150, 250, 150);
		sketch.noStroke();
		physics.particles.forEach(p => {
			if (p !== mouseAttractor) {
				gfx.particle(p, 6);
			}
		});

		// Draw attractor
		sketch.fill(250, 100, 100);
		gfx.particle(mouseAttractor, 15);

		// Draw attraction radius
		sketch.noFill();
		sketch.stroke(250, 100, 100, 50);
		gfx.circle(mouseAttractor.position, attraction.radius);
	};
});
```

## License

MIT
