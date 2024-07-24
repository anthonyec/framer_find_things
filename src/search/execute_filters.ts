import type { CategoryFilter, Filter, TextFilter } from './filters';
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

	return false
}

function executeFilter(filter: Filter, node: ResultNode): Promise<Result | boolean> {
	switch(filter.type) {
		case "text":
			return executeTextFilter(filter, node)

		case "category":
			return executeCategoryFilter(filter, node)

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

		console.log({include, result, node})

		if (include && result) {
			results.push(result)
		}
	}

	console.log(results)

	return results;
}
