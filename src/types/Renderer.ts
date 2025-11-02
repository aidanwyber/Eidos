export interface Renderer {
	strokeCap(cap: string): void;
	strokeJoin(join: string): void;

	line(x1: number, y1: number, x2: number, y2: number): void;
	rect(
		x: number,
		y: number,
		w: number,
		h: number,
		tl?: number,
		tr?: number,
		br?: number,
		bl?: number
	): void;
	ellipse(x: number, y: number, w: number, h: number): void;
	arc(
		x: number,
		y: number,
		w: number,
		h: number,
		start: number,
		stop: number,
		mode?: string
	): void;
	triangle(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number
	): void;
	quad(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number
	): void;

	beginShape(kind?: number): void;
	endShape(mode?: number): void;
	vertex(x: number, y: number): void;
	curveVertex(x: number, y: number): void;
	bezierVertex(
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number
	): void;
	quadraticVertex(cx: number, cy: number, x3: number, y3: number): void;

	bezier(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number,
		x4: number,
		y4: number
	): void;

	push(): void;
	pop(): void;
	translate(x: number, y: number, z?: number): void;
	rotate(angle: number, axis?: number[]): void;
	scale(s: number, y?: number): void;
	shearX?(angle: number): void;
	shearY?(angle: number): void;
	applyMatrix?(
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number
	): void;
	// resetMatrix?(): void;

	angleMode?(mode: string): void; // always use this for rotations!
	rectMode(mode: string): void;
	ellipseMode(mode: string): void;

	text?(
		str: string | number,
		x: number,
		y: number,
		x2?: number,
		y2?: number
	): void;
	textAlign?(horizAlign: string, vertAlign?: string): void;
	textSize?(size: number): void;
	textFont?(font: string | object, size?: number): void;

	image?(img: any, x: number, y: number, w?: number, h?: number): void;

	blendMode?(mode: string): void;
}
