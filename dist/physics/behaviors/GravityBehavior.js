export class GravityBehavior {
    acc;
    constructor(acc) {
        this.acc = acc;
    }
    applyBehavior(p) {
        p.addForce(this.acc.div(p.mass));
    }
}
//# sourceMappingURL=GravityBehavior.js.map