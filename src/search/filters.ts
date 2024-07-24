interface BaseFilter {
	id: string;
	type: 'text' | "category";
}

export interface TextFilter extends BaseFilter {
	type: 'text';
	query: string;
	caseSensitive: boolean;
	regex: boolean;
}

export interface CategoryFilter extends BaseFilter {
	type: 'category';
	category: "all" | "frame" | "page" | "color-style" | "text-style"
}

export type Filter = TextFilter | CategoryFilter;

export function isTextFilter(filter: Filter | undefined): filter is TextFilter {
	return typeof filter !== 'undefined' && filter.type === 'text';
}

export function isCategoryFilter(filter: Filter | undefined): filter is CategoryFilter {
	return typeof filter !== 'undefined' && filter.type === 'category';
}
