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

	let replacement: string = '';
	let preserveCase: boolean = false;

	const performReplaceAll = () => {
    replaceAll($results, replacement, preserveCase)
	};

  const focusResult = async (result: Result) => {
    await framer.zoomIntoView(result.id)
  }

  textSearchFilter.subscribe(async () => {
    $results = await executeFilters($filters, $index)
  })

  // TODO(anthony): Should this go in an onmount?
  // TODO(anthony): Throttle this!
  framer.subscribeToCanvasRoot(async () => {
    $index = await indexAll()
    $results = await executeFilters($filters, $index)

    console.log("re-index")
  })
</script>

<SearchReplace
	bind:query={$textSearchFilter.query}
	bind:caseSensitive={$textSearchFilter.caseSensitive}
	bind:regex={$textSearchFilter.regex}
	bind:replacement
	bind:preserveCase
	onReplaceAllClick={performReplaceAll}
/>

<!-- TODO(anthony): Why isn't result updating? -->
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

