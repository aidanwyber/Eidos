import { describe, expect, it, vi } from 'vitest';
import { GFX, Particle, Spring, Vec, type SketchLike } from 'eidos';

type SpySketch = SketchLike & {
	line: ReturnType<typeof vi.fn>;
	circle: ReturnType<typeof vi.fn>;
	translate: ReturnType<typeof vi.fn>;
	rotate: ReturnType<typeof vi.fn>;
	push: ReturnType<typeof vi.fn>;
	pop: ReturnType<typeof vi.fn>;
	strokeWeight: ReturnType<typeof vi.fn>;
	stroke: ReturnType<typeof vi.fn>;
};

function createSketch(): SpySketch {
	return {
		push: vi.fn(),
		pop: vi.fn(),
		translate: vi.fn(),
		rotate: vi.fn(),
		scale: vi.fn(),
		line: vi.fn(),
		circle: vi.fn(),
		ellipse: vi.fn(),
		rect: vi.fn(),
		point: vi.fn(),
		beginShape: vi.fn(),
		vertex: vi.fn(),
		curveVertex: vi.fn(),
		endShape: vi.fn(),
		curveTightness: vi.fn(),
		bezier: vi.fn(),
		strokeWeight: vi.fn(),
		stroke: vi.fn(),
		text: vi.fn(),
		textAlign: vi.fn(),
		CLOSE: 'close',
		CENTER: 'center',
		RIGHT: 'right',
		LEFT: 'left',
		TOP: 'top',
		BOTTOM: 'bottom',
	};
}

describe('GFX', () => {
	it('draws particles from their vector coordinates', () => {
		const sketch = createSketch();
		const gfx = new GFX(sketch);

		gfx.particle(new Particle(new Vec(4, 9)), 12);

		expect(sketch.circle).toHaveBeenCalledWith(4, 9, 12);
	});

	it('draws springs from particle endpoints without relying on .position', () => {
		const sketch = createSketch();
		const gfx = new GFX(sketch);
		const spring = new Spring(
			new Particle(new Vec(2, 3)),
			new Particle(new Vec(8, 9)),
			0.25
		);

		gfx.spring(spring, true);

		expect(sketch.line).toHaveBeenNthCalledWith(1, 2, 3, 8, 9);
		expect(sketch.translate).toHaveBeenCalledWith(5, 6);
		expect(sketch.rotate).toHaveBeenCalledWith(Math.atan2(6, 6));
	});
});
