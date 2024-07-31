interface BaseFilter {
	id: string;
	type: 'text' | "category" | "size";
}

export interface TextFilter extends BaseFilter {
	type: 'text';
	query: string;
	caseSensitive: boolean;
	regex: boolean;
}

export const categories = ["all", "frame", "text", "component"] as const

export interface CategoryFilter extends BaseFilter {
	type: 'category';
	category: (typeof categories)[number];
}

export const comparators = [">", "<", "=", "~="] as const

export type Comparator = (typeof comparators)[number]

export const comparatorNames: Record<Comparator, string> = {
	"<": "Smaller than",
	">": "Bigger than",
	"=": "Exactly is",
	"~=": "Kinda is"
}

export interface SizeFilter extends BaseFilter {
	type: "size";
	width: number | undefined;
	height: number | undefined;
	comparator: Comparator;
}

export type Filter = TextFilter | CategoryFilter | SizeFilter;

export function isTextFilter(filter: Filter | undefined): filter is TextFilter {
	return typeof filter !== 'undefined' && filter.type === 'text';
}

export function isCategoryFilter(filter: Filter | undefined): filter is CategoryFilter {
	return typeof filter !== 'undefined' && filter.type === 'category';
}

export function isSizeFilter(filter: Filter | undefined): filter is SizeFilter {
	return typeof filter !== 'undefined' && filter.type === 'size';
}
