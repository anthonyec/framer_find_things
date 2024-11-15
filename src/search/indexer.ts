import type { IndexEntry } from "./types";
import type {
  FrameNode,
  TextNode,
  ComponentInstanceNode,
  SVGNode,
} from "framer-plugin";

import {
  framer,
  isComponentInstanceNode,
  isFrameNode,
  isSVGNode,
  isTextNode,
  isWebPageNode,
  WebPageNode,
} from "framer-plugin";

type CanvasNode = FrameNode | TextNode | ComponentInstanceNode | SVGNode;

function isCanvasNode(value: unknown): value is CanvasNode {
  if (isFrameNode(value)) return true;
  if (isComponentInstanceNode(value)) return true;
  if (isTextNode(value)) return true;
  if (isSVGNode(value)) return true;

  return false;
}

async function getDefaultCanvasNodeName(node: CanvasNode): Promise<string> {
  if (isFrameNode(node)) {
    return "Frame";
  }

  if (isTextNode(node)) {
    return (await node.getText()) ?? "";
  }

  return "";
}

interface IndexerOptions {
  scope: "project" | "page";
  include: IndexEntry["type"][];
  onStarted: () => void;
  onUpsert: (entry: IndexEntry) => void;
  onCompleted: () => void;
}

export class Indexer {
  private entries: Record<string, IndexEntry> = {};
  private batchSize: number = 10;
  private scope: IndexerOptions["scope"] = "page";
  private include: IndexerOptions["include"];
  private abortRequested: boolean = false;
  private onStarted: IndexerOptions["onStarted"] | undefined;
  private onUpsert: IndexerOptions["onUpsert"] | undefined;
  private onCompleted: IndexerOptions["onCompleted"] | undefined;

  constructor(options: IndexerOptions) {
    this.scope = options.scope;
    this.include = options.include;
    this.onStarted = options.onStarted;
    this.onUpsert = options.onUpsert;
    this.onCompleted = options.onCompleted;
  }

  private upsertEntries(entries: IndexEntry[]) {
    for (const entry of entries) {
      this.entries[entry.id] = entry;
      this.onUpsert?.(entry);
    }
  }

  private async *crawl(pages: WebPageNode[]): AsyncGenerator<IndexEntry[]> {
    let batch: IndexEntry[] = [];

    for (const page of pages) {
      for await (const node of page.walk()) {
        if (!isCanvasNode(node)) continue;
        if (this.include.length > 0 && !this.include.includes(node.__class)) continue

        const rect = await node.getRect();
        const text = isTextNode(node) ? await node.getText() : null;
        const name = node.name ?? (await getDefaultCanvasNodeName(node));

        batch.push({
          id: node.id,
          type: node.__class,
          locked: node.locked,
          visible: node.visible,
          name,
          rect,
          text,
        });

        if (batch.length === this.batchSize) {
          yield batch;
          batch = [];
        }
      }
    }

    if (batch.length > 0) {
      yield batch;
    }
  }

  private async getPages(): Promise<WebPageNode[]> {
    const root = await framer.getCanvasRoot();
    if (!isWebPageNode(root)) return [];

    if (this.scope === "page") {
      return [root];
    }

    return await framer.getNodesWithType("WebPageNode");
  }

  async start() {
    const pages = await this.getPages();

    this.onStarted?.();

    for await (const batch of this.crawl(pages)) {
      if (this.abortRequested) return;

      this.upsertEntries(batch);
    }

    this.onCompleted?.();
  }
}
