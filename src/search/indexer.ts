import type { IndexEntry } from "./types";

import { framer, isTextNode, isWebPageNode, WebPageNode } from "framer-plugin";

interface IndexerOptions {
  scope: "project" | "page"
  onStarted: () => void;
  onProgress: (entries: IndexEntry[]) => void;
  onCompleted: (entries: IndexEntry[]) => void;
}

export class Indexer {
  private entries: IndexEntry[] = [];
  private batchSize: number = 10;
  private scope: IndexerOptions["scope"] = "page"
  private onStarted: IndexerOptions["onStarted"] | undefined;
  private onProgress: IndexerOptions["onProgress"] | undefined;
  private onCompleted: IndexerOptions["onCompleted"] | undefined;

  constructor(options: IndexerOptions) {
    this.scope = options.scope
    this.onStarted = options.onStarted;
    this.onProgress = options.onProgress;
    this.onCompleted = options.onCompleted;
  }

  async start() {
    const root = await framer.getCanvasRoot();
    if (!isWebPageNode(root)) return;

    this.onStarted?.();

    let pages: WebPageNode[] = [root];

    if (this.scope === "project") {
      const webPages = await framer.getNodesWithType("WebPageNode");
      pages = webPages
    }

    let batch: IndexEntry[] = [];

    for (const page of pages) {
      for await (const node of page.walk()) {
        if (!isTextNode(node) || node.isReplica) continue;

        const rect = await node.getRect();
        if (!rect) continue;

        const text = await node.getText();
        if (!text || !text.trim()) continue;

        batch.push({
          id: node.id,
          type: "text",
          name: node.name ?? text ?? "",
          locked: node.locked,
          hidden: !node.visible, // TODO(anthony): Rename hidden to visible.
          rect,
          text,
        });

        if (batch.length === this.batchSize) {
          this.entries.push(...batch);
          this.onProgress?.(batch);

          batch = [];
        }
      }
    }

    if (batch.length > 0) {
      this.entries.push(...batch);
      this.onProgress?.(batch);
    }

    this.onCompleted?.(this.entries);
  }
}
