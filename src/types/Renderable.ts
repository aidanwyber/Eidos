import { Renderer } from './Renderer';

export interface Renderable {
	draw: (renderer: Renderer) => void;
	// draw: (renderer: Renderer, ...args: any[]) => void;
}
