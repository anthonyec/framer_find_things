import type { Filter } from './filters';

class Search {
	private filters: Filter[] = [];

	addFilter(filter: Filter) {
		this.filters.push(filter);
	}
}
