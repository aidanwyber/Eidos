import { Vec } from './Vec';
export declare class Circle extends Vec {
    radius: number;
    constructor(center: Vec, radius: number);
    distanceToPoint(pt: Vec): number;
    distanceToCircle(c: Circle): number;
}
//# sourceMappingURL=Circle.d.ts.map