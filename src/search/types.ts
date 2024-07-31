import type { CanvasNode, ColorStyle, TextStyle } from 'framer-plugin';
import type { Range } from '../utils/text';

export type IndexNodeType = "unknown" | "frame" | "text" | "component" | "svg"

export interface IndexEntry {
	id: string;
	type: IndexNodeType
	name: string;
	text: string | null;
	rect: { x: number, y: number, width: number, height: number }
}

export interface Result {
	id: string;
	title: string;
	ranges: Range[];
}
