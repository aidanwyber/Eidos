import { Vec } from './Vec';
export class Circle extends Vec {
    radius;
    constructor(center, radius) {
        super(center);
        this.radius = radius;
    }
    distanceToPoint(pt) {
        return this.distanceTo(pt) - this.radius;
    }
    distanceToCircle(c) {
        return this.distanceTo(c) - this.radius - c.radius;
    }
}
//# sourceMappingURL=Circle.js.map