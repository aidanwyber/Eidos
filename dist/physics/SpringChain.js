import { PhysicsEngine, Spring, Particle } from './index';
export class SpringChain {
    particles;
    constructor(physics, firstParticle, dir, length, segmentCount, k) {
        this.particles = [firstParticle];
        const segmentLength = length / segmentCount;
        const segmentVector = dir.scale(segmentLength);
        let lastParticle = firstParticle;
        physics.addParticle(firstParticle);
        for (let i = 0; i < segmentCount; i++) {
            let p = new Particle(lastParticle.add(segmentVector));
            this.particles.push(p);
            physics.addParticle(p);
            lastParticle = p;
        }
        for (let i = 0; i < this.particles.length - 1; i++) {
            let pi = this.particles[i];
            let pn = this.particles[i + 1];
            new Spring(pi, pn, segmentLength, k);
        }
    }
}
//# sourceMappingURL=SpringChain.js.map