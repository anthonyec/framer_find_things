<script lang="ts">
  import type { CanvasNode, IndexEntry, Result } from "./search/types";
  import type { CategoryFilter, Filter, TextFilter } from "./search/filters";

  import SearchReplace from "./components/search_replace.svelte";
  import { executeFilters } from "./search/execute_filters";
  import { framer } from "framer-plugin";
  import { Indexer } from "./search/indexer";
  import starsImage from "./assets/stars.png";
  import Results from "./components/results.svelte";
  import { BatchProcessResults } from "./search/batch_process_results";
  import Tabs from "./components/tabs.svelte";
  import { assertNever } from "./utils/assert";
  import { replaceAllRanges } from "./utils/text";

  let currentRootId: string = $state()
  let currentPage: "search" | "clean" = $state("search")

  let indexing: boolean = $state(false);
  let replacing: boolean = $state(false);
  let selectedNodeIds: string[] = $state([]);

  let index: Record<string, IndexEntry> = $state({});

  let textSearchFilter: TextFilter = $state({
    id: "text-search",
    type: "text",
    query: "",
    caseSensitive: false,
    regex: false,
  });
  let categoryFilter: CategoryFilter = $state({
    id: "category",
    type: "category",
    category: "all",
  });

  let filters: Filter[] = $state([textSearchFilter, categoryFilter]);
  let entries: IndexEntry[] = $derived(Object.values(index));
  let results: Result[] = $derived(executeFilters(filters, entries));

  let replacement: string = $state("");

  const indexer = new Indexer({
      scope: "page",
      includedNodeTypes: ["FrameNode", "SVGNode", "ComponentInstanceNode"],
      includedAttributes: [],

      onRestarted: () => {
        index = {}
      },

      onStarted: () => {
        indexing = true;
        replacer.setReady(false);
      },

      onUpsert: (entry) => {
        index[entry.id] = entry;
      },

      onCompleted: () => {
        indexing = false;
        replacer.setReady(true);
      },
    });

  const replacer = new BatchProcessResults({
    process: async (result: Result, node: CanvasNode, index: number) => {
      switch(currentPage) {
        case "search":
          const replacedName = replaceAllRanges(
            result.title,
            replacement,
            result.ranges,
            false
          );

          await node.setAttributes({ name: replacedName });
          return

        case "clean":
          return

        default:
          assertNever(currentPage)
      }
    },

    onStarted: () => {
      replacing = true;
    },

    onProgress: (count, total) => {},

    onCompleted: () => {
      replacing = false;
      indexer.restart()
    },
  });

  const replaceAll = () => {
    if (!replacement) return;
    replacer.start(results);
  };

  $effect(() => {
    return framer.subscribeToSelection((selection) => {
      selectedNodeIds = selection.map((node) => node.id);
    });
  });

  $effect(() => {
    currentRootId;
    indexer.restart()
  })

  $effect(() => {
    index = {};

    indexer.start();

    return framer.subscribeToCanvasRoot(async () => {
      const root = await framer.getCanvasRoot()
      currentRootId = root.id
    });
  });
</script>

<div class="app">
  <Tabs
    items={[
      { label: "Search", active: () => currentPage === "search", select: () => currentPage = "search" },
      { label: "Clean", active: () => currentPage === "clean", select: () => currentPage = "clean" }
    ]}
  />

  {#if results.length === 0}
    <div class="splash">
      <img src={starsImage} alt="Stars" />
    </div>
  {:else}
    <Results
      query={textSearchFilter.query}
      {selectedNodeIds}
      {indexing}
      {results}
      replacement={currentPage === "search" ? replacement : ""}
    />
  {/if}

  <SearchReplace
    bind:query={textSearchFilter.query}
    bind:replacement
    loading={replacing}
    showReplacement={currentPage === "search"}
    actionLabel={currentPage === "search" ? "Rename" : "Clean Up"}
    onRenameClick={replaceAll}
  />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 0 15px 15px;
  }

  .splash {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  .splash img {
    width: 190px;
  }

  .info {
    color: var(--framer-color-text-tertiary);
    border-top: 1px solid var(--framer-color-divider);
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 42px;
    flex-shrink: 0;
    user-select: none;
  }

  .count {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
