interface BaseFilter {
	id: string;
	type: 'text';
}

export interface TextFilter extends BaseFilter {
	query: string;
	caseSensitive: boolean;
	regex: boolean;
}

export type Filter = TextFilter;

export function isTextFilter(filter: Filter | undefined): filter is TextFilter {
	return typeof filter !== 'undefined' && filter.type === 'text';
}
