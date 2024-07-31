import { isCanvasNode } from '../utils/traits';
import type { IndexEntry, IndexNodeType } from './types';

import { framer, isComponentInstanceNode, isFrameNode, isSVGNode, isTextNode, } from 'framer-plugin';

export async function buildIndex(): Promise<IndexEntry[]> {
	const root = await framer.getCanvasRoot();

  const index: IndexEntry[] = [];

	for await (const node of root.walk()) {
    if (isCanvasNode(node) && node.isReplica) continue

    const rect = await node.getRect()
    if (!rect) continue

    let text: string | null = null
    let name: string | null = null
    let type: IndexNodeType = "unknown"

    if (isFrameNode(node)) {
      name = node.name
      type = "frame"
    }

    if (isTextNode(node)) {
      name = node.name
      text = await node.getText()
      type = "text"
    }

    if (isComponentInstanceNode(node)) {
      name = node.name
      type = "component"
    }

    if (isSVGNode(node)) {
      name = node.name
      type = "svg"
    }

    index.push({
      id: node.id,
      type,
      name: name ?? text ?? "",
      text,
      rect
    })
	}

	return index;
}
