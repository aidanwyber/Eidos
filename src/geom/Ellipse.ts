import { Renderer } from '../types/Renderer';
import { Renderable } from '../types/Renderable';
import { Vec } from './Vec';

export class Ellipse implements Renderable {
	private a: Vec;
	private b: Vec;
	private focalLength: number;
	private majorAxis: number;
	private minorAxis: number;
	readonly rotation: number;
	center: Vec;

	/**
	 * Construct an ellipse defined by two focal points and the sum of distances to those foci.
	 * @param a Focal point A
	 * @param b Focal point B
	 * @param majorLength Sum of the distances from any point on the ellipse to the two foci
	 */
	constructor(a: Vec, b: Vec, majorLength: number);
	/**
	 * Construct an ellipse defined by its center, width, and height.
	 * @param center Center point of the ellipse
	 * @param width Width of the ellipse
	 * @param height Height of the ellipse
	 */
	constructor(center: Vec, width: number, height: number);
	constructor(...args: [Vec, Vec, number] | [Vec, number, number]) {
		if (
			args.length === 3 &&
			args[0] instanceof Vec &&
			args[1] instanceof Vec &&
			typeof args[2] === 'number'
		) {
			// Construction from foci and major axis length
			const [a, b, majorLength] = args;
			this.a = a.copy();
			this.b = b.copy();
			this.center = a.midPointTo(b);
			this.focalLength = a.distanceTo(b);
			this.majorAxis = majorLength;
			this.minorAxis = Math.sqrt(
				Math.pow(majorLength, 2) - Math.pow(this.focalLength, 2)
			);
			this.rotation = b.sub(a).angle();
		} else if (
			args.length === 3 &&
			args[0] instanceof Vec &&
			typeof args[1] === 'number' &&
			typeof args[2] === 'number'
		) {
			// Construction from center, width, and height
			const [center, width, height] = args as [Vec, number, number];
			this.center = center.copy();
			this.majorAxis = Math.max(width, height);
			this.minorAxis = Math.min(width, height);
			this.rotation = width >= height ? 0 : Math.PI / 2;

			// Calculate foci
			const focalDist = Math.sqrt(
				Math.pow(this.majorAxis / 2, 2) -
					Math.pow(this.minorAxis / 2, 2)
			);
			const focalVec = Vec.fromAngle(this.rotation).scale(focalDist);
			this.a = this.center.sub(focalVec);
			this.b = this.center.add(focalVec);
			this.focalLength = focalDist * 2;
		} else {
			throw new Error('Invalid constructor arguments for Ellipse');
		}
	}

	/**
	 * Get the width (major axis) of the ellipse
	 */
	get width(): number {
		return this.majorAxis;
	}

	/**
	 * Get the height (minor axis) of the ellipse
	 */
	get height(): number {
		return this.minorAxis;
	}

	getRotation(): number {
		return this.rotation;
	}

	getEccentricity(): number {
		return this.focalLength / this.majorAxis;
	}

	/**
	 * Evaluate a point on the ellipse at angle t
	 * @param theta Angle in radians
	 */
	evaluate(theta: number): Vec {
		const x = (this.majorAxis / 2) * Math.cos(theta);
		const y = (this.minorAxis / 2) * Math.sin(theta);
		const rotatedX =
			x * Math.cos(this.rotation) - y * Math.sin(this.rotation);
		const rotatedY =
			x * Math.sin(this.rotation) + y * Math.cos(this.rotation);
		return new Vec(this.center.x + rotatedX, this.center.y + rotatedY);
	}

	getPoints(n: number): Vec[] {
		const points: Vec[] = [];
		for (let i = 0; i < n; i++) {
			const t = (i / n) * Math.PI * 2;
			points.push(this.evaluate(t));
		}
		return points;
	}

	copy(): Ellipse {
		return new Ellipse(this.a, this.b, this.majorAxis);
	}

	draw(renderer: Renderer) {
		renderer.push();
		renderer.translate(this.center.x, this.center.y);
		renderer.rotate(this.rotation);
		renderer.ellipse(0, 0, this.majorAxis, this.minorAxis);
		renderer.pop();
	}

	toString(): string {
		return `Ellipse(center: ${this.center}, a: ${this.a}, b: ${this.b}, major: ${this.majorAxis}, minor: ${this.minorAxis}, rotation: ${this.rotation})`;
	}
}
