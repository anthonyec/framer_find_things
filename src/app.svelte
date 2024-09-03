<script lang="ts">
  import type { IndexEntry, Result } from "./search/types"
  import type { CategoryFilter, Filter, TextFilter } from "./search/filters";

  import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
  import { executeFilters } from './search/execute_filters';
  import { replaceAll } from "./search/replace_all"
  import { framer } from "framer-plugin"
  import ResultRow from "./components/result_row.svelte";
  import { pluralize } from "./utils/text";
  import Filters from "./components/filters.svelte";
  import { clamp } from "./utils/math";
  import { Indexer } from "./search/indexer";
  import Spinner from "./components/spinner.svelte";
  import PlaceholderResultRow from "./components/placeholder_result_row.svelte";

  let indexing: boolean = $state(false)
  let selectedIndex: number = $state(-1)
  let canvasSelection: string[] = $state([])

  let index: Record<string, IndexEntry> = $state({})

  let textSearchFilter: TextFilter = $state({
    id: "text-search",
    type: "text",
    query: "",
    caseSensitive: false,
    regex: false,
  })
  let categoryFilter: CategoryFilter = $state({ id: "category", type: "category", category: "all" })

  let filters: Filter[] = $state([textSearchFilter, categoryFilter])
  let entries: IndexEntry[] = $derived(Object.values(index))
  let results: Result[] = $derived(executeFilters(filters, entries))

	let replacement: string = $state("");
	let preserveCase: boolean = $state(false);
	let searchProject: boolean = $state(false);

	const performReplaceAll = () => {
    if (!replacement) return

    replaceAll(results, replacement, preserveCase)
	};

  const navigateResults = (direction: number) => {
    selectedIndex = clamp(selectedIndex + direction, 0, results.length - 1)
  }

  const focusResult = async (result: Result) => {
    await framer.setSelection(result.id)
    await framer.zoomIntoView(result.id)
  }

  $effect(() => {
    return framer.subscribeToSelection((selection) => {
      canvasSelection = selection.map((node) => node.id)
    })
  })

  $effect(() => {
    index = {}

    const indexer = new Indexer({
      scope: searchProject ? "project" : "page",
      include: [],

      onStarted: () => {
        indexing = true
      },

      onUpsert: (entry) => {
        index[entry.id] = entry
      },

      onCompleted: () => {
        indexing = false
      }
    })

    indexer.start()

    return framer.subscribeToCanvasRoot(async () => {
      // indexer.start()
    })
  })
</script>

<div class="app">
  <SearchReplace
    bind:query={textSearchFilter.query}
    bind:caseSensitive={textSearchFilter.caseSensitive}
    bind:regex={textSearchFilter.regex}
    bind:replacement
    bind:preserveCase
    bind:searchProject
    onReplaceAllClick={performReplaceAll}
    onNavigate={navigateResults}
  >
    <Filters slot="additional-filters" bind:filters={filters} />
  </SearchReplace>

  <div class="results">
    {#each results as result (result.title, result.ranges)}
      <ResultRow
        selected={canvasSelection.includes(result.id)}
        result={result}
        onclick={() => focusResult(result)}
      >
        <HighlightRange
          title={result.title}
          ranges={result.ranges}
          {replacement}
          {preserveCase}
          selected={canvasSelection.includes(result.id)}
        />
      </ResultRow>
    {/each}

    {#if indexing && textSearchFilter.query}
      <PlaceholderResultRow index={0} total={5} width={30} />
      <PlaceholderResultRow index={1} total={5} width={50} />
      <PlaceholderResultRow index={2} total={5} width={20} />
      <PlaceholderResultRow index={3} total={5} width={70} />
      <PlaceholderResultRow index={4} total={5} width={20} />
    {/if}

    {#if results.length === 0 && textSearchFilter.query}
      <div class="empty-state">
        {#if !indexing}
          No results
        {/if}
      </div>
    {/if}
  </div>

  {#if results.length !== 0}
    <div class="info">
      {#if indexing}
        <Spinner />
      {/if}

      <span class="count">
        {results.length} {pluralize("result", "results", results.length)}
      </span>
    </div>
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .results {
    border-radius: 8px 8px 0 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
    height: 100%;
    margin: 0 8px;
    padding-bottom: 8px;
    overflow-y: scroll;
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

  .empty-state {
    color: var(--framer-color-text-tertiary);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
