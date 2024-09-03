import type { IndexEntry } from "./types";

import { framer, isTextNode, isWebPageNode, TextNode, WebPageNode, type AnyNode } from "framer-plugin";

interface IndexerOptions {
  scope: "project" | "page"
  onStarted: () => void;
  onUpsert: (entry: IndexEntry) => void;
  onCompleted: () => void;
}

export class Indexer {
  private entries: Record<string, IndexEntry> = {}
  private batchSize: number = 10;
  private scope: IndexerOptions["scope"] = "page"
  private abortRequested: boolean = false
  private onStarted: IndexerOptions["onStarted"] | undefined;
  private onUpsert: IndexerOptions["onUpsert"] | undefined;
  private onCompleted: IndexerOptions["onCompleted"] | undefined;

  constructor(options: IndexerOptions) {
    this.scope = options.scope
    this.onStarted = options.onStarted;
    this.onUpsert = options.onUpsert;
    this.onCompleted = options.onCompleted;
  }

  private upsertEntries(entries: IndexEntry[]) {
    for (const entry of entries) {
      this.entries[entry.id] = entry
      this.onUpsert?.(entry)
    }
  }

  private async *crawl(pages: WebPageNode[]): AsyncGenerator<IndexEntry[]> {
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
        })

        if (batch.length === this.batchSize) {
          yield batch
          batch = [];
        }
      }
    }

    if (batch.length > 0) {
      yield batch
    }
  }

  private async getPages(): Promise<WebPageNode[]> {
    const root = await framer.getCanvasRoot();
    if (!isWebPageNode(root)) return []

    if (this.scope === "page") {
      return [root]
    }

    return await framer.getNodesWithType("WebPageNode");
  }

  async start() {
    const pages = await this.getPages()

    this.onStarted?.();

    for await (const batch of this.crawl(pages)) {
      if (this.abortRequested) return

      this.upsertEntries(batch);
    }

    this.onCompleted?.();
  }
}
