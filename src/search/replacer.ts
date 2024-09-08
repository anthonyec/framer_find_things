import type { Result } from "./types";

import { framer } from "framer-plugin";
import { isCanvasNode } from "./traits";
import { replaceAllRanges } from "../utils/text";

interface ReplacerOptions {
  onStarted: () => void;
  onProgress: (count: number, total: number) => void;
  onCompleted: () => void;
}

interface StartOptions {
  results: Result[];
  replacement: string;
  preserveCase: boolean;
}

export class Replacer {
  private indexing: boolean = false;
  private started: boolean = false;
  private batchSize: number = 10;
  private onStarted: ReplacerOptions["onStarted"];
  private onProgress: ReplacerOptions["onProgress"];
  private onCompleted: ReplacerOptions["onCompleted"];

  constructor(options: ReplacerOptions) {
    this.onStarted = options.onStarted;
    this.onProgress = options.onProgress;
    this.onCompleted = options.onCompleted;
  }

  private async waitForIndexingToComplete(): Promise<void> {
    return new Promise((resolve) => {
      const poll = () => {
        if (!this.indexing) {
          return resolve();
        }

        setTimeout(poll, 500);
      };

      poll();
    });
  }

  private async *replace(results: Result[]): AsyncGenerator<Result[]> {
    let batch: Result[] = [];

    for (const result of results) {
      batch.push(result);

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
    if (this.started) return;

    this.started = true;
    this.onStarted();

    await this.waitForIndexingToComplete();

    let count: number = 0;

    for await (const batch of this.replace(options.results)) {
      for (const result of batch) {
        const node = await framer.getNode(result.id);
        if (!isCanvasNode(node)) continue;

        const replacedName = replaceAllRanges(
          result.title,
          options.replacement,
          result.ranges,
          options.preserveCase
        );

        await node.setAttributes({ name: replacedName });
      }

      count += batch.length;
      this.onProgress(count, options.results.length);
    }

    this.started = false;
    this.onCompleted();
  }

  setIndexing(indexing: boolean) {
    this.indexing = indexing;
  }
}
