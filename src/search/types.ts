import type { CanvasNode, ColorStyle, TextStyle } from "framer-plugin";
import type{ Range } from "../utils/text";

export type ResultNode = CanvasNode | ColorStyle | TextStyle

export interface Result {
  id: string;
  title: string;
  node: ResultNode;
  ranges: Range[];
}

export type SearchIndex = ResultNode[];
