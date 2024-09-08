import type { CanvasNode } from "framer-plugin";
import type { Result } from "./types";

interface ReplacerOptions {
  onStarted: () => void;
  onCompleted: () => void;
}

interface StartOptions {
  results: Result[]
  replacement: string
  preserveCase: boolean
}

export class Replacer {
  private indexing: boolean = false;
  private started: boolean = false;
  private batchSize: number = 10;
  private onStarted: ReplacerOptions["onStarted"];
  private onCompleted: ReplacerOptions["onCompleted"];

  constructor(options: ReplacerOptions) {
    this.onStarted = options.onStarted;
    this.onCompleted = options.onCompleted;
  }

  private async waitForIndexingToComplete(): Promise<void> {
    return new Promise((resolve) => {
      const poll = () => {
        if (!this.indexing) {
          return resolve()
        }

        setTimeout(poll, 500)
      }

      poll()
    })
  }

  private async *replace(results: Result[]): AsyncGenerator<Result[]> {
    let batch: Result[] = [];

    for (const result of results) {
      batch.push(result)

      if (batch.length === this.batchSize) {
        yield batch;
        batch = [];
      }
    }

    if (batch.length > 0) {
      yield batch;
    }
  }

  async start(options: StartOptions) {
    if (this.started) return

    this.started = true
    this.onStarted()

    await this.waitForIndexingToComplete()

    for await (const result of this.replace(options.results)) {
      console.log(result)
    }

    this.started = false
    this.onCompleted()
  }

  setIndexing(indexing: boolean) {
    this.indexing = indexing;
  }
}
