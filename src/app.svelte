<script lang="ts">
  import type { Result } from "./search/types"

  import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
	import { index, filters, results, textSearchFilter } from './stores/search';
  import { executeFilters } from './search/execute_filters';
  import { indexAll } from './search/index_all';
  import { framer } from "framer-plugin"
  import ResultRow from "./components/result_row.svelte";

	let replacement: string = '';
	let preserveCase: boolean = false;

  // TODO(anthony): Couldn't get this to work. But neither does a store $results work??
  // let results: Result[] = []

	const replaceAll = () => {
		// TODO(anthony): Perform real replace all.
		console.log('Replace', $textSearchFilter.query, 'with', replacement);
	};

  const focusResult = async (result: Result) => {
    await framer.zoomIntoView(result.id)
    console.log('wow')
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
	onReplaceAllClick={replaceAll}
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
