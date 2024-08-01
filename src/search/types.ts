import type { ColorRGBA } from '../utils/color';
import type { Range } from '../utils/text';

export type IndexNodeType = "unknown" | "frame" | "text" | "component" | "svg" | "color-style" | "text-style"

export interface IndexEntry {
	id: string;
	type: IndexNodeType
	name: string;
	text: string | null;
	rect: { x: number, y: number, width: number, height: number } | null
	colors: ColorRGBA[]
	hidden: boolean
	locked: boolean
}

export interface Result {
	id: string;
	title: string;
	ranges: Range[];
	entry: IndexEntry;
}
