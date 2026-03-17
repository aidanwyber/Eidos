import { describe, expect, it } from 'vitest';
import { Ellipse, Vec } from 'eidos';

describe('Ellipse', () => {
	it('constructs from a center, width, and height', () => {
		const ellipse = new Ellipse(new Vec(12, 8), 10, 5);

		expect(ellipse.center.x).toBe(12);
		expect(ellipse.center.y).toBe(8);
		expect(ellipse.width).toBe(10);
		expect(ellipse.height).toBe(5);
		expect(ellipse.getRotation()).toBe(0);
	});

	it('defaults tall ellipses to a vertical major axis', () => {
		const ellipse = new Ellipse(new Vec(0, 0), 5, 10);

		expect(ellipse.width).toBe(10);
		expect(ellipse.height).toBe(5);
		expect(ellipse.getRotation()).toBeCloseTo(Math.PI / 2);
	});

	it('applies the optional rotation on top of the base orientation', () => {
		const ellipse = new Ellipse(new Vec(0, 0), 5, 10, Math.PI / 4);

		expect(ellipse.getRotation()).toBeCloseTo((3 * Math.PI) / 4);
	});

	it('rejects non-positive dimensions', () => {
		expect(() => new Ellipse(new Vec(0, 0), 0, 5)).toThrow(
			'Ellipse width and height must both be greater than zero'
		);
	});
});
