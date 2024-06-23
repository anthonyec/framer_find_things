import type { SearchIndex } from './types';

import { framer } from 'framer-plugin';

export async function indexAll() {
	const newIndex: SearchIndex = [];
	const root = await framer.getCanvasRoot();

	for await (const node of root.walk()) {
		// @ts-expect-error - There is a bug with the type definition for `walk`.
		// https://framer-team.slack.com/archives/C06L5H5ADK2/p1717662923244229
		newIndex.push(node);
	}

	const colorStyles = await framer.getColorStyles();
	const textStyles = await framer.getTextStyles();

	for (const colorStyle of colorStyles) {
		newIndex.push(colorStyle);
	}

	for (const textStyle of textStyles) {
		newIndex.push(textStyle);
	}

	return newIndex;
}
