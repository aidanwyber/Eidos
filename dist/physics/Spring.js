export class Spring {
    a;
    b;
    restLength;
    k; // Spring constant
    damping = 0.05;
    static epsilon = 1e-2;
    constructor(a, b, restLength, k) {
        this.a = a;
        this.b = b;
        this.restLength = restLength === null ? a.distanceTo(b) : restLength;
        this.k = k;
        a.addSpring(this);
        b.addSpring(this);
    }
    apply() {
        const diff = this.b.sub(this.a);
        const dx = diff.mag() - this.restLength;
        if (Math.abs(dx) > Spring.epsilon) {
            const force = diff.normalizeTo(this.k * -dx);
            this.a.addForce(force.scale(-0.5));
            this.b.addForce(force.scale(+0.5));
        }
    }
}
//# sourceMappingURL=Spring.js.map