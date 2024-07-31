import type { CategoryFilter, Filter, SizeFilter, TextFilter } from './filters';
import type { Result, ResultNode, SearchIndex } from './types';

import { isComponentInstanceNode, isFrameNode, isTextNode } from 'framer-plugin';
import { isCategoryFilter, isTextFilter } from './filters';
import { isCanvasNode } from '../utils/traits';
import { findRanges } from '../utils/text';
import { assert, assertNever } from '../utils/assert';

async function executeTextFilter(filter: TextFilter, node: ResultNode): Promise<Result | boolean> {
	if (isComponentInstanceNode(node)) {
		// TODO(anthony): This does not work unless component instance has
		// been named on the canvas. Which most won't have names.
		const text = node.name;
		if (!text) return false;

		const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
		if (!ranges.length) return false;

		return {
			id: node.id,
			title: text,
			node: node,
			ranges
		}
	}

	if (isFrameNode(node)) {
		const text = node.name ?? 'Frame';
		if (!text) return false;

		const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
		if (!ranges.length) return false;

		return {
			id: node.id,
			title: text,
			node: node,
			ranges
		}
	}

	if (isTextNode(node)) {
		const text = await node.getText();
		if (!text) return false;

		const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
		if (!ranges.length) return false;

		return {
				id: node.id,
				title: text,
				node: node,
				ranges: ranges
		};
	}

	return false
}

async function executeCategoryFilter(filter: CategoryFilter, node: ResultNode): Promise<Result | boolean> {
	if (filter.category === "all") {
		return true
	}

	if (filter.category === "frame") {
		return isFrameNode(node)
	}

	if (filter.category === "text") {
		return isTextNode(node)
	}

	if (filter.category === "component") {
		return isComponentInstanceNode(node)
	}

	return false
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

async function executeSizeFilter(filter: SizeFilter, node: ResultNode): Promise<Result | boolean> {
	if (isFrameNode(node) || isTextNode(node) || isComponentInstanceNode(node)) {
		const rect = await node.getRect()
		if (!rect) return false

		let matchWidth: boolean = true
		let matchHeight: boolean = true

		if (filter.width) {
			matchWidth = isComparatorMatch(rect.width, filter.comparator, filter.width)
		}

		if (filter.height) {
			matchHeight = isComparatorMatch(rect.width, filter.comparator, filter.height)
		}

		const text = isTextNode(node) ? await node.getText() : null

		if (matchWidth && matchHeight) {
			return {
				id: node.id,
				title: text ?? node.name ?? '', // TODO(anthony): Add function to get layer name.
				ranges: [],
				node,
			}
		} else {
			return false
		}
	}

	return true
}

function executeFilter(filter: Filter, node: ResultNode): Promise<Result | boolean> {
	switch(filter.type) {
		case "text":
			return executeTextFilter(filter, node)

		case "category":
			return executeCategoryFilter(filter, node)

		case "size":
			return executeSizeFilter(filter, node)

		default:
			assertNever(filter)
	}
}

export async function executeFilters(filters: Filter[], index: SearchIndex) {
	const results: Result[] = [];

	for (const node of index) {
		if (isCanvasNode(node) && node.isReplica) continue;

		let include: boolean = true
		let result: Result | undefined

		for (const filter of filters) {
			const filterResult = await executeFilter(filter, node)

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
