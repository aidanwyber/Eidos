# AGENTS.md

## Scope

These guidelines cover the whole repository **except** the generated `dist/` folder.

## Project overview

-   Eidos is a TypeScript geometry, physics, and rendering toolkit targeting p5.js sketches.
-   Source is grouped under `src/geom`, `src/physics`, and `src/gfx`, then re-exported from `src/index.ts` for package consumers.

## Tooling & build

-   Install dependencies with `npm install`, then build with `npm run build` (tsup bundles CJS, ESM, and declaration files).
-   Leave `dist/` alone; regenerate it via the build instead of editing compiled output.
-   TypeScript runs in strict mode—keep code compatible with the existing `tsconfig.json`.

## Style conventions

-   Match the existing tab-based indentation, semicolons, and comment style.
-   Prefer the established API shape: pure methods returning new objects alongside mutating `*Self` variants (e.g., `Vec.add` vs. `Vec.addSelf`).
-   When overloading methods (as in `GFX` drawing helpers or `Rect` constructors), supply explicit overload signatures above the implementation.
-   Use explicit typing for exported APIs; rely on `@ts-ignore` only when interacting with untyped p5 features.

## Geometry module (`src/geom`)

-   Treat `Vec` as the foundational math type—reuse its helpers instead of duplicating vector math.
-   Keep shapes (`Line`, `Circle`, `Rect`) lightweight data holders with computed accessors and intersection helpers.
-   If you add new vector operations, provide both pure and mutating forms for consistency.

## Physics module (`src/physics`)

-   `Particle` subclasses `Vec`; respect its Verlet-style integration (prev/temp/force vectors) and spring registration hooks.
-   Extend `PhysicsEngine` cautiously: new forces should follow the existing pattern of toggled booleans and per-particle loops.
-   Springs must register with both endpoint particles so they participate in `updateParticles`.
-   Behaviors should implement the `Behavior` interface so they can slot into the (currently commented) behavior pipeline.

## Graphics module (`src/gfx`)

-   `GFX` always receives a `p5` instance; keep new drawing helpers as thin adapters over p5 calls.
-   Maintain overloads that accept either `Vec` arguments or raw coordinate numbers.
-   When adding helpers that rely on untyped p5 APIs, document the usage and minimize `@ts-ignore` scope.

## Exports

-   Add new public APIs through the relevant `src/<module>/index.ts` file and re-export them from `src/index.ts` so they surface in the package entry point.
