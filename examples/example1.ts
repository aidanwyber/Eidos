import p5 from 'p5';
import Eidos from '../src';
import { Particle, Spring, AttractionBehavior } from './src/physics';

new p5((sketch: p5) => {
	let physics: Eidos.PhysicsEngine;
	let gfx: Eidos.GFX;
	let attractor: Particle;

	sketch.setup = () => {
		sketch.createCanvas(800, 600);

		// Initialize physics engine
		physics = new Eidos.PhysicsEngine();
		physics.setGravity(0, 0.1);

		// Initialize graphics helper
		gfx = new Eidos.GFX(sketch);

		// Create some particles
		for (let i = 0; i < 20; i++) {
			const x = sketch.random(100, sketch.width - 100);
			const y = sketch.random(100, sketch.height - 100);
			const p = physics.addParticle(new Particle(x, y, 1));
			p.velocity.set(sketch.random(-2, 2), sketch.random(-2, 2));
		}

		// Create an attractor at center
		attractor = physics.addParticle(
			new Particle(sketch.width / 2, sketch.height / 2, 10)
		);
		attractor.lock();

		// Add attraction behavior
		const attraction = new AttractionBehavior(attractor, 300, 0.5, 20);
		physics.addBehavior(attraction);

		// Create some springs between random particles
		for (let i = 0; i < 10; i++) {
			const a =
				physics.particles[
					Math.floor(sketch.random(physics.particles.length))
				];
			const b =
				physics.particles[
					Math.floor(sketch.random(physics.particles.length))
				];
			if (a !== b && a !== attractor && b !== attractor) {
				physics.addSpring(new Spring(a, b, 0.05));
			}
		}
	};

	sketch.draw = () => {
		sketch.background(255);

		// Update physics
		physics.update();

		// Draw springs
		sketch.stroke(200);
		sketch.strokeWeight(1);
		physics.springs.forEach(spring => {
			gfx.spring(spring);
		});

		// Draw particles
		sketch.fill(100, 150, 250);
		sketch.noStroke();
		physics.particles.forEach(particle => {
			if (particle !== attractor) {
				gfx.particle(particle, 10);
			}
		});

		// Draw attractor
		sketch.fill(250, 100, 100);
		gfx.particle(attractor, 20);

		// Optional: Draw attraction radius
		sketch.noFill();
		sketch.stroke(250, 100, 100, 50);
		sketch.strokeWeight(1);
		sketch.circle(attractor.position.x, attractor.position.y, 600);
	};

	sketch.mousePressed = () => {
		// Add particle at mouse position
		const p = physics.addParticle(
			new Particle(sketch.mouseX, sketch.mouseY)
		);
		p.velocity.set(sketch.random(-5, 5), sketch.random(-5, 5));
	};
});
