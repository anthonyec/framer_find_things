import type { Result } from "./types";

import { framer, isFrameNode, isTextNode } from "framer-plugin";
import { replaceAllRanges } from "../utils/text";

export async function replaceAll(
  results: Result[],
  replacement: string,
  preserveCase: boolean
) {
  for (const result of results) {
    const node = await framer.getNode(result.id);
    if (!node) continue;

    if (isTextNode(node)) {
      const replacedText = replaceAllRanges(
        result.title,
        replacement,
        result.ranges,
        preserveCase
      );

      await node.setText(replacedText);
    }

    if (isFrameNode(node)) {
      const replacedText = replaceAllRanges(
        result.title,
        replacement,
        result.ranges,
        preserveCase
      );

      await node.setAttributes({ name: replacedText });
    }
  }
}
