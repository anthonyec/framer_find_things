<script lang="ts">
	import { onMount } from 'svelte';
	import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
	import { filters, textSearchFilter } from './stores/search';

	// import { framer } from "framer-plugin"

	// onMount(async () => {
	//   const i = await import("framer-plugin")
	//   console.log(i)
	// })

	let replacement: string = '';
	let preserveCase: boolean = false;

	const replaceAll = () => {
		// TODO(anthony): Perform real replace all.
		console.log('Replace', $textSearchFilter.query, 'with', replacement);
	};
</script>

<SearchReplace
	bind:query={$textSearchFilter.query}
	bind:caseSensitive={$textSearchFilter.caseSensitive}
	bind:regex={$textSearchFilter.regex}
	bind:replacement
	bind:preserveCase
	onReplaceAllClick={replaceAll}
/>

Debug filters:
{#each $filters as filter}
	<div>{filter.id} - {filter.query} - {filter.caseSensitive} - {filter.regex}</div>
{/each}

<HighlightRange
	title="Hello there"
	{replacement}
	ranges={[
		[0, 2],
		[2, 5]
	]}
	{preserveCase}
/>
