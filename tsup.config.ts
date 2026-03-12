import { defineConfig } from 'tsup';

export default defineConfig({
	dts: true,
	sourcemap: true,
	treeshake: true,
	splitting: false,
	clean: true,
	outDir: 'dist',
	entry: {
		'index': 'src/index.ts',
		'physics/index': 'src/physics/index.ts',
		'geom/index': 'src/geom/index.ts',
		'math/index': 'src/math/index.ts',
		'gfx/index': 'src/gfx/index.ts',
	},
	format: ['esm', 'cjs'],
});
