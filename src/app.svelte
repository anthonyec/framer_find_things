<script lang="ts">
  import type { Result } from "./search/types"

  import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
	import { index, filters, results, textSearchFilter } from './stores/search';
  import { executeFilters } from './search/execute_filters';
  import { indexAll } from './search/index_all';
  import { replaceAll } from "./search/replace_all"
  import { framer } from "framer-plugin"
  import ResultRow from "./components/result_row.svelte";
  import { pluralize } from "./utils/text";

	let replacement: string = '';
	let preserveCase: boolean = false;

	const performReplaceAll = () => {
    if (!replacement) return

    replaceAll($results, replacement, preserveCase)
	};

  const focusResult = async (result: Result) => {
    await framer.zoomIntoView(result.id)
    await framer.setSelection(result.id)
  }

  textSearchFilter.subscribe(async () => {
    $results = await executeFilters($filters, $index)
  })

  // TODO(anthony): Should this go in an onmount?
  // TODO(anthony): Throttle this!
  framer.subscribeToCanvasRoot(async () => {
    $index = await indexAll()
    $results = await executeFilters($filters, $index)

    console.log("re-index", $results)
  })
</script>

<div class="app">
  <SearchReplace
    bind:query={$textSearchFilter.query}
    bind:caseSensitive={$textSearchFilter.caseSensitive}
    bind:regex={$textSearchFilter.regex}
    bind:replacement
    bind:preserveCase
    onReplaceAllClick={performReplaceAll}
  >
    <div slot="additional-filters">
      {#each $filters as filter}
        {#if filter.id !== "text-search"}
          <button>{filter.id}</button>
        {/if}
      {/each}

      <button>+</button>
    </div>
  </SearchReplace>

  <div class="info">
    <span>
      {#if $results.length === 0}
        No results found
      {:else}
        {$results.length} {pluralize("result", "results", $results.length)}
      {/if}
    </span>
  </div>

  <!-- TODO(anthony): Why isn't result updating? -->
  <div class="results">
    {#each $results as result}
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
