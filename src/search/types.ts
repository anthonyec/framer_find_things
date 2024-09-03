import type { Range } from '../utils/text';
import type { CanvasNode } from 'framer-plugin';

export type IndexNodeType = "unknown" | "frame" | "text" | "component" | "svg" | "color-style" | "text-style"

export interface IndexEntry {
	id: string;
	type: Exclude<CanvasNode["__class"], "UnknownNode">
	name: string;
	text: string | null;
	rect: { x: number, y: number, width: number, height: number } | null
	visible: boolean
	locked: boolean
}

export interface Result {
	id: string;
	title: string;
	ranges: Range[];
	entry: IndexEntry;
}
