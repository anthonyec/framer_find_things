import type { Result } from './types';

import { isComponentInstanceNode, isFrameNode, isTextNode } from 'framer-plugin';
import { replaceAllRanges } from '../utils/text';
// import { isColorStyle, isTextStyle } from '../utils/traits';

export async function replaceAll(results: Result[], replacement: string, preserveCase: boolean) {
	for (const result of results) {
		const { title, node, ranges } = result;

		if (isTextNode(node)) {
			const replacedText = replaceAllRanges(title, replacement, ranges, preserveCase);

			await node.setText(replacedText);
			continue;
		}

		if (isFrameNode(node)) {
			const replacedText = replaceAllRanges(
				node.name ?? 'Frame',
				replacement,
				ranges,
				preserveCase
			);

			await node.setAttributes({ name: replacedText });
			continue;
		}

		if (isComponentInstanceNode(node)) { //  || isColorStyle(node) || isTextStyle(node)
			if (!node.name) continue;

			const replacedText = replaceAllRanges(node.name, replacement, ranges, preserveCase);

			console.log('replace', node);

			await node.setAttributes({ name: replacedText });
			continue;
		}
	}
}
