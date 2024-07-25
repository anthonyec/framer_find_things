<script lang="ts">
  import type { Result, SearchIndex } from "./search/types"

  import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
  import { executeFilters } from './search/execute_filters';
  import { indexAll } from './search/index_all';
  import { replaceAll } from "./search/replace_all"
  import { framer } from "framer-plugin"
  import ResultRow from "./components/result_row.svelte";
  import { pluralize } from "./utils/text";
  import Filters from "./components/filters.svelte";
  import type { Filter, TextFilter } from "./search/filters";

  let searchIndex: SearchIndex = $state([])
  let textSearchFilter: TextFilter = $state({
    id: "text-search",
    type: "text",
    query: "",
    caseSensitive: false,
    regex: false,
  })
  let filters: Filter[] = $state([textSearchFilter])
  let results: Result[] = $state([])

	let replacement: string = $state("");
	let preserveCase: boolean = $state(false);

	const performReplaceAll = () => {
    if (!replacement) return

    replaceAll(results, replacement, preserveCase)
	};

  const focusResult = async (result: Result) => {
    await framer.zoomIntoView(result.id)
    await framer.setSelection(result.id)
  }

  $effect(() => {
    textSearchFilter.query;
    filters;

    executeFilters(filters, searchIndex).then((newResults) => {
      results = newResults
    })
  })

  $effect(() => {
    // TODO(anthony): Throttle this!
    return framer.subscribeToCanvasRoot(async () => {
      searchIndex = await indexAll()
      results = await executeFilters(filters, searchIndex)

      console.log("re-index", results)
    })
  })

  $inspect("filters", filters)
  $inspect("results", results)
</script>

<div class="app">
  <SearchReplace
    bind:query={textSearchFilter.query}
    bind:caseSensitive={textSearchFilter.caseSensitive}
    bind:regex={textSearchFilter.regex}
    bind:replacement
    bind:preserveCase
    onReplaceAllClick={performReplaceAll}
  >
    <Filters slot="additional-filters" bind:filters={filters} />
  </SearchReplace>

  <div class="info">
    <span>
      {#if results.length === 0}
        No results found
      {:else}
        {results.length} {pluralize("result", "results", results.length)}
      {/if}
    </span>
  </div>

  <!-- TODO(anthony): Why isn't result updating? -->
  <div class="results">
    {#each results as result (result.title, result.ranges)}
      <ResultRow on:click={() => focusResult(result)}>
        <HighlightRange
          title={result.title}
          ranges={result.ranges}
          {replacement}
          {preserveCase}
        />
      </ResultRow>
    {/each}
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .info {
    display: flex;
    justify-content: space-between;
  }

  .results {
    overflow-y: scroll;
  }
</style>
