import { Renderer } from '../types/Renderer';
import { Renderable } from '../types/Renderable';
import { Vec } from './Vec';

export class Circle extends Vec implements Renderable {
	radius: number;

	constructor(center: Vec, radius: number) {
		super(center);
		this.radius = radius;
	}

	distanceToPoint(pt: Vec) {
		return this.distanceTo(pt) - this.radius;
	}

	distanceToCircle(c: Circle): number {
		return this.distanceTo(c) - this.radius - c.radius;
	}

	draw(renderer: Renderer) {
		renderer.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
	}
}
