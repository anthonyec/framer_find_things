import type { IndexEntry } from './types';

import { framer, isTextNode } from 'framer-plugin';

interface IndexerOptions {
  onStarted: () => void
  onProgress: (entries: IndexEntry[]) => void
  onCompleted: (entries: IndexEntry[]) => void
}

export class Indexer {
  running: boolean = false
  entries: IndexEntry[] = []

  private batchSize: number = 50
  private onStarted: IndexerOptions["onStarted"] | undefined
  private onProgress: IndexerOptions["onProgress"] | undefined
  private onCompleted: IndexerOptions["onCompleted"] | undefined

  constructor(options: IndexerOptions) {
    this.onStarted = options.onStarted
    this.onProgress = options.onProgress
    this.onCompleted = options.onCompleted
  }

  async start() {
    this.onStarted?.()

  	const root = await framer.getCanvasRoot();

    let batch: IndexEntry[] = []

    for await (const node of root.walk()) {
      if (!isTextNode(node) || node.isReplica) continue

      const rect = await node.getRect()
      if (!rect) continue

      const text = await node.getText()
      if (!text || !text.trim()) continue

      batch.push({
        id: node.id,
        type: "text",
        name: node.name ?? text ?? "",
        locked: node.locked,
        hidden: !node.visible, // TODO(anthony): Rename hidden to visible.
        rect,
        text,
      })

      if (batch.length === this.batchSize)  {
        this.entries.push(...batch)
        this.onProgress?.(batch)

        batch = []
      }
    }

    if (batch.length > 0) {
      this.entries.push(...batch)
    }

    this.onCompleted?.(this.entries)
  }
}
