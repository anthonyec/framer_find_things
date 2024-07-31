import type { CategoryFilter, Filter, SizeFilter, TextFilter } from './filters';
import type { IndexEntry, Result } from './types';

import { findRanges } from '../utils/text';
import { assertNever } from '../utils/assert';

type FilterResult = Result | boolean

function executeTextFilter(filter: TextFilter, entry: IndexEntry): FilterResult {
	const text = entry.text ?? entry.name;
	if (!text) return false;

	const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
	if (!ranges.length) return false;

	return {
		id: entry.id,
		title: text,
		ranges
	}
}

function executeCategoryFilter(filter: CategoryFilter, entry: IndexEntry): FilterResult {
	if (filter.category === "all") {
		return true
	}

	return filter.category === entry.type
}

function isComparatorMatch(a: number, comparator: SizeFilter["comparator"], b: number): boolean {
	switch(comparator) {
		case "<":
			return a < b
		case ">":
			return a > b
		case "=":
			return a === b
		case "~=":
			return b > (a - 10) && b < (a + 10)
		default:
			assertNever(comparator)
	}
}

function executeSizeFilter(filter: SizeFilter, entry: IndexEntry): FilterResult {
	const rect = entry.rect
	if (!rect) return false

	let isWidthMatch: boolean = true
	let isHeightMatch: boolean = true


	if (filter.width) {
		isWidthMatch = isComparatorMatch(rect.width, filter.comparator, filter.width)
	}

	if (filter.height) {
		isHeightMatch = isComparatorMatch(rect.height, filter.comparator, filter.height)
	}

	return isWidthMatch && isHeightMatch
}

function executeFilter(filter: Filter, entry: IndexEntry): FilterResult {
	switch(filter.type) {
		case "text":
			return executeTextFilter(filter, entry)

		case "category":
			return executeCategoryFilter(filter, entry)

		case "size":
			return executeSizeFilter(filter, entry)

		default:
			assertNever(filter)
	}
}

export function executeFilters(filters: Filter[], index: IndexEntry[]) {
	const results: Result[] = [];

	for (const entry of index) {
		let include: boolean = true
		let result: Result | undefined

		for (const filter of filters) {
			const filterResult =  executeFilter(filter, entry)

			if (typeof filterResult !== "boolean") {
				result = filterResult
			}

			if (filterResult === false) {
				include = false
				break
			}
		}

		if (include && result) {
			results.push(result)
		}
	}

	return results;
}
