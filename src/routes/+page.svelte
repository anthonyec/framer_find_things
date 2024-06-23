<script>
	import HighlightRange from "../components/highlight_range.svelte";
	import SearchReplace from "../components/search_replace.svelte";
</script>

<style>
  :global(body) {
    background-color: black;
    color: white;
    margin: 0;
  }
</style>

<SearchReplace />

<HighlightRange title="hello there" replacement={undefined} ranges={[[0, 2], [2, 5]]} preserveCase={false} />
