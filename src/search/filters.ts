interface BaseFilter {
	id: string;
	type: 'text' | "category" | "size" | "layer";
}

export interface TextFilter extends BaseFilter {
	type: 'text';
	query: string;
	caseSensitive: boolean;
	regex: boolean;
}

export const categories = ["all", "frame", "text", "component", "color-style", "text-style"] as const

export interface CategoryFilter extends BaseFilter {
	type: 'category';
	category: (typeof categories)[number];
}

export const comparators = [">", "<", "=", "~="] as const

export type Comparator = (typeof comparators)[number]

export const comparatorNames: Record<Comparator, string> = {
	"<": "smaller than",
	">": "bigger than",
	"=": "exactly is",
	"~=": "kinda is"
}

export interface SizeFilter extends BaseFilter {
	type: "size";
	width: number | undefined;
	height: number | undefined;
	comparator: Comparator;
}

export interface LayerFilter extends BaseFilter {
	type: "layer"
	hidden: boolean
	locked: boolean
}

export type Filter = TextFilter | CategoryFilter | SizeFilter | LayerFilter;

export function isTextFilter(filter: Filter | undefined): filter is TextFilter {
	return typeof filter !== 'undefined' && filter.type === 'text';
}

export function isCategoryFilter(filter: Filter | undefined): filter is CategoryFilter {
	return typeof filter !== 'undefined' && filter.type === 'category';
}

export function isSizeFilter(filter: Filter | undefined): filter is SizeFilter {
	return typeof filter !== 'undefined' && filter.type === 'size';
}

export function isLayerFilter(filter: Filter | undefined): filter is LayerFilter {
	return typeof filter !== 'undefined' && filter.type === 'layer';
}
