import type { CanvasNode } from "framer-plugin"

import { isComponentInstanceNode, isFrameNode, isSVGNode, isTextNode, ColorStyle, TextStyle } from "framer-plugin"

// TODO(anthony): Add these traits to the API if more people need them?
export function isColorStyle(value: unknown): value is ColorStyle {
  return value instanceof ColorStyle
}

export function isTextStyle(value: unknown): value is TextStyle {
  return value instanceof TextStyle
}

export function isCanvasNode(value: unknown): value is CanvasNode {
  if (isFrameNode(value)) return true
  if (isComponentInstanceNode(value)) return true
  if (isTextNode(value)) return true
  if (isSVGNode(value)) return true

  return false
}
