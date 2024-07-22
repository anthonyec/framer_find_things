import type { Filter } from './filters';
import type { Result, ResultNode, SearchIndex } from './types';

import { isComponentInstanceNode, isFrameNode, isTextNode } from 'framer-plugin';
import { isTextFilter } from './filters';
import { isCanvasNode, isColorStyle, isTextStyle } from '../utils/traits';
import { findRanges } from '../utils/text';

export async function executeFilters(filters: Filter[], index: SearchIndex) {
	const results: Result[] = [];

	for (const node of index) {
		if (isCanvasNode(node) && node.isReplica) continue;

		for (const filter of filters) {
			if (isTextFilter(filter)) {
				if (isComponentInstanceNode(node)) {
					// TODO(anthony): This does not work unless component instance has
					// been named on the canvas. Which most won't have names.
					const text = node.name;
					if (!text) continue;

					const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
					if (!ranges.length) continue;

					results.push({
						id: node.id,
						title: text,
						node: node,
						ranges
					});
				}

				if (isFrameNode(node)) {
					const text = node.name ?? 'Frame';
					if (!text) continue;

					const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
					if (!ranges.length) continue;

					results.push({
						id: node.id,
						title: text,
						node: node,
						ranges
					});
				}

				if (isTextNode(node)) {
					const text = await node.getText();
					if (!text) continue;

					const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
					if (!ranges.length) continue;

					results.push({
						id: node.id,
						title: text,
						node: node,
						ranges
					});
				}

				if (isColorStyle(node) || isTextStyle(node)) {
					const text = node.name;
					if (!text) continue;

					const ranges = findRanges(text, filter.query, filter.caseSensitive, filter.regex);
					if (!ranges.length) continue;

					results.push({
						id: node.id,
						title: text,
						node: node,
						ranges
					});
				}
			}
		}
	}

	return results;
}
