<script lang="ts">
  import type { IndexEntry, Result } from "./search/types";
  import type { CategoryFilter, Filter, TextFilter } from "./search/filters";

  import SearchReplace from "./components/search_replace.svelte";
  import { executeFilters } from "./search/execute_filters";
  import { framer } from "framer-plugin";
  import { Indexer } from "./search/indexer";
  import starsImage from "./assets/stars.png";
  import Results from "./components/results.svelte";
  import { Replacer } from "./search/replacer";

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
  let searchProject: boolean = $state(false);

  const replacer = new Replacer({
    onStarted: () => {
      replacing = true;
    },

    onCompleted: () => {
      replacing = false;
    },
  });

  const replaceAll = () => {
    if (!replacement) return;

    replacer.start({
      results,
      replacement,
      preserveCase: false,
    });
  };

  $effect(() => {
    return framer.subscribeToSelection((selection) => {
      selectedNodeIds = selection.map((node) => node.id);
    });
  });

  $effect(() => {
    index = {};

    const indexer = new Indexer({
      scope: searchProject ? "project" : "page",
      includedNodeTypes: ["FrameNode", "SVGNode", "ComponentInstanceNode"],
      includedAttributes: [],

      onStarted: () => {
        indexing = true;
        replacer.setIndexing(true);
      },

      onUpsert: (entry) => {
        index[entry.id] = entry;
      },

      onCompleted: () => {
        indexing = false;
        replacer.setIndexing(false);
      },
    });

    indexer.start();

    return framer.subscribeToCanvasRoot(async () => {
      // indexer.start()
    });
  });
</script>

<!-- svelte-ignore state_referenced_locally -->
<div class="app">
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
      {replacement}
    />
  {/if}

  <SearchReplace
    bind:query={textSearchFilter.query}
    bind:replacement
    {replacing}
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
    gap: 10px;
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
    width: 159px;
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
