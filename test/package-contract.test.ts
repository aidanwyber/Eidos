import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const rootDir = fileURLToPath(new URL('..', import.meta.url));
const packageJson = JSON.parse(
	readFileSync(join(rootDir, 'package.json'), 'utf8')
) as {
	main: string;
	module: string;
	types: string;
	exports: Record<
		string,
		string | { import?: string; require?: string; types?: string }
	>;
};

function resolveTarget(target: string): string {
	return join(rootDir, target);
}

describe('package contract', () => {
	it('emits every declared entrypoint target', () => {
		const targets = new Set<string>([
			packageJson.main,
			packageJson.module,
			packageJson.types,
		]);

		for (const entry of Object.values(packageJson.exports)) {
			if (typeof entry === 'string') {
				targets.add(entry);
				continue;
			}

			for (const target of Object.values(entry)) {
				if (target) {
					targets.add(target);
				}
			}
		}

		for (const target of targets) {
			expect(existsSync(resolveTarget(target)), `${target} should exist`).toBe(
				true
			);
		}
	});

	it('supports esm self-reference imports', async () => {
		const root = await import('eidos');
		const physics = await import('eidos/physics');
		const geom = await import('eidos/geom');
		const math = await import('eidos/math');
		const gfx = await import('eidos/gfx');

		expect(root.Vec).toBeTypeOf('function');
		expect(physics.PhysicsEngine).toBeTypeOf('function');
		expect(geom.Ellipse).toBeTypeOf('function');
		expect(math.simplexNoise).toBeTypeOf('function');
		expect(gfx.GFX).toBeTypeOf('function');
	});

	it('supports cjs self-reference requires', () => {
		const root = require('eidos');
		const physics = require('eidos/physics');
		const geom = require('eidos/geom');
		const math = require('eidos/math');
		const gfx = require('eidos/gfx');

		expect(root.Vec).toBeTypeOf('function');
		expect(physics.PhysicsEngine).toBeTypeOf('function');
		expect(geom.Ellipse).toBeTypeOf('function');
		expect(math.simplexNoise).toBeTypeOf('function');
		expect(gfx.GFX).toBeTypeOf('function');
	});
});
