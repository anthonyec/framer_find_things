import type { Color, IndexEntry, IndexNodeType } from './types';
import type { TextStyleTag } from "framer-plugin"

import { isCanvasNode } from '../utils/traits';
import { framer, isComponentInstanceNode, isFrameNode, isSVGNode, isTextNode, } from 'framer-plugin';
import { assertNever } from '../utils/assert';
import * as color from "../utils/color"

function getTextStyleTagName(tag: TextStyleTag): string {
  switch (tag) {
    case "h1":
      return "Heading 1"
    case "h2":
      return "Heading 2"
    case "h3":
      return "Heading 3"
    case "h4":
      return "Heading 4"
    case "h5":
      return "Heading 5"
    case "h6":
      return "Heading 6"
    case "p":
      return "Body"
    default:
      assertNever(tag)
  }
}

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
    let hidden: boolean = false
    let locked: boolean = false
    const colors: Color[] = []

    if (isFrameNode(node)) {
      name = node.name
      type = "frame"
      locked = node.locked
    }

    if (isTextNode(node)) {
      name = node.name
      text = await node.getText()
      type = "text"
      locked = node.locked
    }

    if (isComponentInstanceNode(node)) {
      name = node.name
      type = "component"
      locked = node.locked
    }

    if (isSVGNode(node)) {
      name = node.name
      type = "svg"
      locked = node.locked
    }

    index.push({
      id: node.id,
      type,
      name: name ?? text ?? "",
      text,
      rect,
      colors,
      hidden,
      locked
    })
	}

  const colorStyles = await framer.getColorStyles()
  const textStyles = await framer.getTextStyles()

  for (const colorStyle of colorStyles) {
    index.push({
      id: colorStyle.id,
      type: "color-style",
      name: colorStyle.name,
      text: null,
      rect: null,
      colors: [color.parseColorRGBA(colorStyle.light ?? "")], // TODO(anthony): Add dark color here.
      hidden: false,
      locked: false
    })
  }

  for (const textStyle of textStyles) {
    index.push({
      id: textStyle.id,
      type: "text-style",
      name: textStyle.name || getTextStyleTagName(textStyle.tag),
      text: null,
      rect: null,
      colors: [color.parseColorRGBA(textStyle.color ?? "")],
      hidden: false,
      locked: false
    })
  }

	return index;
}
