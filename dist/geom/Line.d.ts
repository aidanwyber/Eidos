import { Vec } from './Vec';
import { Circle } from './Circle';
export declare class Line {
    a: Vec;
    b: Vec;
    constructor(a: Vec, b: Vec);
    getHeading(): Vec;
    getDir(): Vec;
    getLength(): number;
    getMidpoint(): Vec;
    copy(): Line;
    toString(): string;
    intersectLine(line: Line): Vec;
    intersectCircle(circle: Circle): Vec[];
    static fromAngleLength(angle: number, length: number, origin?: Vec): Line;
}
