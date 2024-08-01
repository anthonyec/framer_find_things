<script lang="ts">
  import type { IndexEntry, Result } from "./search/types"
  import type { Filter, TextFilter } from "./search/filters";

  import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
  import { executeFilters } from './search/execute_filters';
  import { replaceAll } from "./search/replace_all"
  import { framer } from "framer-plugin"
  import ResultRow from "./components/result_row.svelte";
  import { pluralize } from "./utils/text";
  import Filters from "./components/filters.svelte";
  import { buildIndex } from "./search/build_index";

  let index: IndexEntry[] = $state([])
  let textSearchFilter: TextFilter = $state({
    id: "text-search",
    type: "text",
    query: "",
    caseSensitive: false,
    regex: false,
  })
  let filters: Filter[] = $state([textSearchFilter])
  let results: Result[] = $derived(executeFilters(filters, index))

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
    // TODO(anthony): Throttle this!
    return framer.subscribeToCanvasRoot(async () => {
      index = await buildIndex()
      console.log("re-index", results)
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
      <ResultRow result={result} onclick={() => focusResult(result)}>
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
    padding: 0 16px;
  }

  .results {
    overflow-y: scroll;
  }
</style>
