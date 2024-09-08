<script lang="ts">
  import TextField from "./text_field.svelte";
	import iconSearch from "../assets/icon_search.svg?raw";

  interface Props {
    query: string;
    replacement: string;
    onRenameClick?: () => void;
  }

  let {
    query = $bindable(),
    replacement = $bindable(),
    onRenameClick = () => {},
  }: Props = $props();

  let searchInput: HTMLInputElement;

  $effect(() => {
    searchInput.focus();
  });
</script>

<div class="search-replace">
  <TextField placeholder="Find" bind:value={query}>
		{#snippet leadingContent()}
			{@html iconSearch}
		{/snippet}
	</TextField>

  <TextField placeholder="Rename To…" bind:value={replacement} />

  <button class="rename-button" onclick={onRenameClick} disabled={!replacement}>Rename</button>
</div>

<style>
  .search-replace {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 15px;
    padding-top: 0;
  }

	.rename-button {
		background: #111111;
		color: white;
	}
</style>
