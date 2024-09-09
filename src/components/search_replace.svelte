<script lang="ts">
  import TextField from "./text_field.svelte";
	import iconSearch from "../assets/icon_search.svg?raw";
  import Spinner from "./spinner.svelte";

  interface Props {
    query: string;
    replacement: string;
		replacing: boolean
    onRenameClick?: () => void;
  }

  let {
    query = $bindable(),
    replacement = $bindable(),
		replacing,
    onRenameClick = () => {},
  }: Props = $props();
</script>

<div class="search-replace">
  <TextField placeholder="Find" bind:value={query} focused disabled={replacing}>
		{#snippet leadingContent()}
			{@html iconSearch}
		{/snippet}
	</TextField>

  <TextField placeholder="Rename To…" bind:value={replacement} disabled={replacing} />

  <button class="rename-button" onclick={onRenameClick} disabled={!replacement || replacing}>
		{#if replacing}
			<Spinner type="solid" />
		{:else}
			Rename
		{/if}
	</button>
</div>

<style>
  .search-replace {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

	.rename-button {
		background: #111111;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global([data-framer-theme="dark"]) .rename-button {
		background: white;
		color: black;
	}
</style>
