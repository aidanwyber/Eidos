# Eidos Roadmap

## Goal

Turn Eidos from an early-stage geometry + Verlet sketch toolkit into a trustworthy, modern, TypeScript-first 2D physics library with strong creative-coding ergonomics and first-class p5.js support.

## Product Direction

Eidos should be built as two layers:

1. A renderer-agnostic physics and geometry core.
2. Thin integration packages and helpers for p5.js and other creative-coding environments.

That separation is important. A professional physics library cannot have simulation correctness, packaging, and testability tied to one rendering runtime.

## Guiding Decisions

### 1. Fix correctness before adding headline features

Rigid bodies, contacts, and events will not matter if force integration, mass semantics, and stepping are still inconsistent.

### 2. Separate particle physics from rigid-body physics

Keep the current particle/spring system as a supported subsystem, but do not force the future rigid-body engine to inherit its assumptions. They can share math, broadphase infrastructure, collision shapes, and world stepping, but not necessarily the same solver internals.

### 3. Make performance an explicit design constraint

The `mass` / `inverseMass` issue is not only about correctness. It is also about avoiding repeated recomputation in hot loops. The public API should expose read-only getters and controlled mutation methods.

Recommended direction:

- `private _mass: number`
- `private _inverseMass: number`
- `get mass(): number`
- `get inverseMass(): number`
- no public writable `mass` field
- `setMass(mass: number): this` updates both cached values exactly once

The same pattern should later extend to rigid-body mass properties:

- `mass`
- `inverseMass`
- `inertia`
- `inverseInertia`

### 4. Keep the core deterministic and renderer-agnostic

The physics core should accept explicit time deltas and produce state changes only. Rendering helpers, mouse helpers, and p5-specific drawing adapters should live outside the solver.

### 5. Build the public API in modules

Recommended module layout over time:

- `src/geom`
- `src/math`
- `src/physics/particles`
- `src/physics/rigid`
- `src/physics/collision`
- `src/physics/dynamics`
- `src/physics/common`
- `src/p5` or a separate `@eidos/p5` package

## Phase 0: Stabilize the Current Engine

Objective: make the existing particle/spring engine correct, predictable, and supportable before expanding scope.

### 0.1 Fix simulation semantics

- Define whether accumulated vectors are true forces or accelerations.
- Pick one model and apply it everywhere.
- Refactor `Particle.update()` so integration uses the chosen model consistently.
- Refactor all behaviors to match the chosen model.
- Audit spring solving to ensure mass weighting is still correct after the refactor.

Recommended choice:

- Store accumulated acceleration in the current particle engine, not physical force.
- Behaviors contribute acceleration-like impulses directly for the Verlet particle system.
- Reserve true force and impulse semantics for the future rigid-body engine.

This keeps the current API simpler and avoids mixing force and inverse-mass math in contradictory ways.

### 0.2 Fix `mass` / `inverseMass` API and caching

- Replace writable fields with controlled accessors.
- Keep `inverseMass` cached.
- Forbid invalid states such as negative mass.
- Define behavior for `mass = 0` as locked/static or explicit infinite-mass particle.
- Add unit tests for all mass edge cases.

### 0.3 Make `timeStep` real or remove it until it is real

- Do not keep a `timeStep` field that affects emitters but not integration.
- Introduce an explicit stepping contract even for the particle engine.
- Remove hidden frame-rate assumptions from behaviors.
- Port behavior parameters to timestep-aware forms.

### 0.4 Fix engine lifecycle and object ownership

- Make every `remove*` method idempotent.
- When removing a particle, also remove all attached springs and contact state.
- When a sink absorbs a particle, remove related springs and references.
- Decide whether the world owns particles/springs exclusively or supports shared ownership; document it clearly.
- Add world-level add/remove hooks for cleanup.

### 0.5 Fix known helper bugs and leaks

- Fix `Vec.constrain()` so both axes clamp correctly.
- Fix particle intersection semantics to account for both radii.
- Fix `Poly.draw()` renderer push/pop symmetry.
- Fix `simplexNoise` typings and the negative-number `fastfloor` implementation.
- Remove or finish partially implemented fields such as particle trails/lifespan if they are part of the public API.

### 0.6 Clean the public API

- Bring README and examples in sync with shipped exports.
- Remove stale API references such as `.velocity`, `.position`, `setGravity`, and `AttractionBehavior`.
- Decide which physics features are officially supported now versus planned.
- Add deprecation notes if names must change.

Exit criteria:

- Current particle/spring engine behaves consistently across all built-in behaviors.
- Public examples compile and run against shipped exports.
- Removal and cleanup paths are safe.
- No known core correctness bug remains untracked.

## Phase 1: Introduce a Real World Stepper

Objective: make simulation timing deterministic and frame-rate independent.

### 1.1 Replace `update()` with explicit stepping APIs

Recommended public API:

```ts
world.step(dtSeconds: number): void;
world.update(frameDtSeconds: number): void;
world.fixedDelta = 1 / 120;
world.maxSubSteps = 8;
```

Behavior:

- `step(dtSeconds)` advances one fixed simulation step.
- `update(frameDtSeconds)` accumulates variable frame time and performs zero or more fixed steps.
- Rendering can optionally interpolate between previous and current state.

### 1.2 Add accumulator-based fixed stepping

- Keep an internal accumulator in seconds.
- Clamp excessively large frame deltas to avoid spiral-of-death behavior.
- Support `maxSubSteps`.
- Expose interpolation alpha for render adapters.

### 1.3 Make all simulation systems timestep-aware

- Particle integration
- spring solving
- damping and drag
- gravity and constant forces
- emitters
- future collision solver
- future rigid-body solver

### 1.4 Add determinism tests

- Same seed + same inputs + same steps should produce same state.
- Variable render frame rates should converge to the same simulation result when using fixed stepping.

Exit criteria:

- The engine behaves consistently at 30, 60, and 144 FPS.
- `timeStep` is replaced by an actual fixed-step design.

## Phase 2: Collision Detection and Response for the Existing Particle World

Objective: move beyond springs and bounds into a usable collision system.

### 2.1 Define collision primitives

Start with:

- circle
- axis-aligned box
- oriented box
- segment
- convex polygon

Use shared shape abstractions that will later serve rigid bodies too.

### 2.2 Build a narrowphase collision layer

Implement:

- circle-circle
- circle-AABB
- circle-segment
- AABB-AABB
- SAT for convex polygon pairs

Outputs should be standardized contact manifolds:

- normal
- penetration depth
- contact points
- feature ids for persistence

### 2.3 Build a broadphase

Phase in order:

1. AABB generation for all collidables.
2. Uniform grid or spatial hash for the first broadphase.
3. Optional sweep-and-prune later if profiling justifies it.

### 2.4 Add collision response

For the particle engine, start simple:

- positional correction
- restitution
- friction
- optional slop / Baumgarte-style correction constants

Do not overfit the particle response to look like a rigid-body solver. Keep it stable and limited.

### 2.5 Add sensors

- Non-resolving contacts
- Event generation without physical response

Exit criteria:

- Particle-world objects can collide with stable resolution.
- Collision pairs are culled by broadphase.
- Sensor-only objects work.

## Phase 3: Contact Events and Collision Filtering

Objective: make collisions observable and controllable.

### 3.1 Add filtering

Recommended model:

- `categoryBits`
- `maskBits`
- optional signed `groupIndex`

This is a proven model and easy for users coming from Box2D-style libraries.

### 3.2 Add persistent contact tracking

Track contact lifecycle:

- `begin`
- `stay`
- `end`

Store contact ids or feature pairs so contacts can persist across steps.

### 3.3 Add event APIs

Recommended forms:

```ts
world.on('contactbegin', handler);
world.on('contactstay', handler);
world.on('contactend', handler);
```

and/or:

```ts
body.onContactBegin(handler);
```

Events should expose:

- involved bodies or particles
- collider/shape references
- sensor flag
- contact normal
- contact points
- impulse if available

### 3.4 Add query APIs

Professional collision systems need more than passive simulation.

Add:

- point queries
- AABB overlap queries
- ray casts
- shape overlap tests

Exit criteria:

- Users can filter collisions by layer/mask.
- Users can observe begin/stay/end contact lifecycle.
- The world supports basic spatial queries.

## Phase 4: Rigid-Body Architecture

Objective: introduce a true rigid-body engine instead of stretching the particle engine beyond its design.

### 4.1 Add rigid-body fundamentals

Core types:

- `RigidBody`
- `Collider`
- `Shape`
- `Transform`
- `MassProperties`
- `ContactManifold`
- `Joint`
- `PhysicsWorld`

Body types:

- `dynamic`
- `static`
- `kinematic`

State:

- position
- rotation
- linear velocity
- angular velocity
- accumulated force
- accumulated torque
- sleeping flags

### 4.2 Add mass and inertia computation

Each collider shape should provide:

- area
- centroid
- mass properties for a density
- inertia tensor scalar for 2D

The body aggregates collider mass properties and caches:

- mass
- inverseMass
- inertia
- inverseInertia

### 4.3 Add integration and solver pipeline

Recommended high-level step order:

1. Apply gravity and external forces.
2. Integrate velocities.
3. Detect broadphase pairs.
4. Run narrowphase and build manifolds.
5. Solve velocity constraints.
6. Integrate positions.
7. Solve position constraints.
8. Update sleeping and contact events.

### 4.4 Start with a small shape set

Version 1 rigid-body shapes:

- circle
- box
- capsule
- convex polygon
- segment or chain for static worlds

### 4.5 Add basic joints

Phase in order:

1. Distance joint
2. Revolute joint
3. Prismatic joint
4. Rope / spring variants

Motorized joints and limits can come after the basics are stable.

Exit criteria:

- Users can simulate dynamic, static, and kinematic rigid bodies.
- Circle and box collisions are stable.
- At least one joint type ships in production quality.

## Phase 5: Solver Quality and Runtime Features

Objective: reach the quality bar expected of modern 2D physics libraries.

### 5.1 Sleeping

- Add sleep thresholds for linear and angular velocity.
- Wake islands on force application, collision, and joint interaction.

### 5.2 Continuous collision handling

- Start with speculative contacts or simple swept tests for fast circles.
- Expand to conservative advancement only if needed.

### 5.3 Islands

- Build islands for solver batching and sleep propagation.
- Solve connected active sets together.

### 5.4 Material system

- restitution
- static friction
- dynamic friction
- density
- sensor flag

Support pairwise material combining rules.

### 5.5 Profiling and memory work

- Remove avoidable `Vec` allocations in hot solver loops.
- Reuse contact/manifold objects where possible.
- Benchmark broadphase, narrowphase, and solver separately.
- Add regression budgets for step time and allocations.

Exit criteria:

- Solver is stable enough for stacked bodies, chains, and simple ragdoll-like structures.
- Hot loops are allocation-aware and benchmarked.

## Phase 6: p5 Integration Strategy

Objective: make p5 support strong without coupling core physics to p5 runtime or type issues.

### 6.1 Decouple p5 from the core package

Recommended direction:

- Move p5 integration out of `dependencies`.
- Use a peer dependency or separate adapter package.

Best long-term option:

- `eidos` for core geometry and physics
- `@eidos/p5` for p5 drawing, helpers, debug rendering, mouse joints, and examples

### 6.2 Define a proper p5 adapter layer

The p5 package should provide:

- debug draw for bodies, colliders, joints, contacts, and AABBs
- shape drawing helpers
- mouse picking and dragging helpers
- interpolation-aware rendering hooks
- typed utilities that work with p5 instance mode

### 6.3 Maintain a renderer-agnostic debug interface

Keep a generic debug renderer contract so the same world can be visualized in:

- p5
- Canvas 2D
- SVG
- custom renderers

### 6.4 Provide real examples

Ship working examples for:

- particle springs
- rigid-body stacks
- collision filtering
- contact events
- mouse interaction
- p5 sketch integration

### 6.5 Fix package ergonomics

- Ensure p5-related examples typecheck in their own example config, not in the core package build.
- Do not let upstream p5 type issues break the core package.
- Document the exact versions and setup needed for p5 consumers.

Exit criteria:

- The core package is independent from p5.
- p5 users still get a polished first-class path.

## Phase 7: Physics-Focused Tests

Objective: move from packaging tests to real simulation confidence.

### 7.1 Unit tests for math and low-level solver pieces

- vector math
- shape overlap tests
- manifold generation
- mass property calculations
- filter matching
- timestep accumulator logic

### 7.2 Scenario tests for particle physics

- spring settling
- bounded bouncing
- attractor behavior
- sink/emitter lifecycle
- fixed-step equivalence across frame rates

### 7.3 Scenario tests for rigid bodies

- body falling under gravity
- restitution bounce height
- friction sliding distance
- box stacking stability
- joint constraint behavior
- sensors and filters

### 7.4 Contact-event tests

- begin/stay/end ordering
- sensor-only events
- filtered collisions produce no events
- wake/sleep interaction with contacts

### 7.5 Property-based and regression tests

- invariants such as non-negative penetration after solve tolerance
- no NaN state after randomized stress scenes
- deterministic replay from fixed seeds

### 7.6 Snapshot and golden-scene tests

- serialize world state after N steps
- compare against approved snapshots for canonical scenes

### 7.7 Performance and stress tests

- 1k particles
- 500 rigid bodies
- dense contact scene
- broadphase-heavy sparse scene

Add a separate benchmark command and track:

- total step time
- broadphase time
- narrowphase time
- solver time
- allocations if measurable

Exit criteria:

- Core physics changes cannot merge without simulation coverage.
- Determinism, stability, and performance regressions are detectable.

## Phase 8: Professionalization and Release Quality

Objective: make Eidos publishable and maintainable as a real library.

### 8.1 Project standards

- Add `npm run typecheck`
- Add linting
- Add formatter rules if desired
- Add CI for build, typecheck, tests, and benchmarks

### 8.2 Documentation

- Rewrite README to reflect current state and roadmap honestly.
- Add API docs for world stepping, forces, bodies, colliders, joints, filters, and events.
- Add migration notes when breaking APIs change.

### 8.3 Versioning and compatibility

- Establish semver expectations.
- Mark experimental APIs explicitly.
- Keep particle and rigid systems clearly separated in docs and exports.

### 8.4 Debugging and tooling

- debug draw overlays
- world inspector helpers
- contact visualization
- performance counters

### 8.5 Example applications

- browser example playground
- p5 example gallery
- minimal non-p5 Canvas example

Exit criteria:

- New users can understand the architecture quickly.
- Releases are gated by CI and documented behavior.

## Recommended Implementation Order

This is the sequence that gives the best risk reduction:

1. Phase 0 correctness and API cleanup
2. Phase 1 fixed-step stepping
3. Phase 2 collision detection/response for the existing world
4. Phase 3 filtering, contact events, and queries
5. Phase 6 p5 decoupling and adapter strategy
6. Phase 7 real physics test suite
7. Phase 4 rigid-body architecture
8. Phase 5 solver quality features
9. Phase 8 release-quality hardening

Reasoning:

- The current engine needs trustworthy semantics before it can host more features.
- Fixed stepping and tests should arrive before rigid bodies, or the rigid-body work will be built on unstable foundations.
- p5 decoupling should happen early enough that core physics design stays clean.

## Suggested Near-Term Milestones

### Milestone A: Correct Particle Engine

- Mass semantics fixed
- stepping semantics fixed
- cleanup and removal fixed
- docs/examples fixed
- particle tests added

### Milestone B: Collision-Capable Creative-Coding Engine

- broadphase
- narrowphase for circles and boxes
- response
- contact events
- filtering
- p5 debug drawing

### Milestone C: First Professional Core Release

- renderer-agnostic core package
- strong tests
- deterministic fixed-step world
- documented collision system
- production-ready packaging and CI

### Milestone D: Rigid-Body Beta

- dynamic/static/kinematic bodies
- circle and box colliders
- stable contacts
- at least one joint
- debug renderer and examples

## Architectural Risks to Watch

- Do not let particle-specific semantics leak into rigid-body APIs.
- Do not keep allocating new `Vec` objects inside inner solver loops once collisions and rigid bodies land.
- Do not let p5 types or runtime assumptions shape the core package.
- Do not add many body shapes before the collision and manifold abstraction is stable.
- Do not promise Box2D-level completeness too early; ship a smaller, well-tested subset first.

## Summary

The first job is not rigid bodies. The first job is to make the current world correct, deterministic, and testable. Once that foundation exists, Eidos can grow into a professional library with:

- fixed-step simulation
- collision detection and response
- contact events and filtering
- a decoupled p5 adapter
- a real rigid-body engine
- a serious physics test suite

That sequence is the shortest path from interesting prototype to dependable library.
