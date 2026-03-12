# TODO

## Critical

- [x] Align the published package contract with the actual build outputs.
  - `main`, `module`, `types`, and `exports` must point at files that are really emitted.
  - `./physics`, `./geom`, `./math`, and `./gfx` subpath exports need matching `dist/` entrypoints.
  - `npm pack` should not be able to publish an empty package from a clean checkout.
- [x] Fix the `Ellipse` implementation so the public constructor works and declarations can be generated.
  - The center/width/height overload is currently unreachable.
  - A stray identifier breaks `tsup --dts`.

## High

- [x] Fix `GFX` particle and spring rendering to use the actual `Particle`/`Spring` shape.
  - The current implementation reads `.position`, but `Particle` stores coordinates directly as `x`/`y`.
- [x] Remove the direct dependency on broken `p5@2` declaration parsing from the library build.
  - `npx tsc --noEmit` currently fails inside `node_modules/p5/types`.

## Medium

- [ ] Bring the README and example code back in sync with the current public API.
  - The quick start references nonexistent `PhysicsEngine` fields.
  - `examples/example1.ts` targets an older API surface and does not typecheck.
- [ ] Make `remove*` APIs idempotent instead of deleting the last item when the target is missing.
  - `splice(indexOf(...), 1)` is used without checking for `-1`.
- [ ] Add basic repository quality gates.
  - Add at least `typecheck`, and decide whether this repo also wants tests and linting before publish.
