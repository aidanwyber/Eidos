import { Vec } from './Vec';
export class Circle extends Vec {
    constructor(center, radius) {
        super(center);
        this.radius = radius;
    }
    distanceToPoint(pt) {
        return this.distanceTo(pt) - this.radius;
    }
}
