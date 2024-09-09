<script lang="ts">
  import TextField from "./text_field.svelte";
	import iconSearch from "../assets/icon_search.svg?raw";
  import Spinner from "./spinner.svelte";

  interface Props {
    query: string;
    replacement: string;
		loading: boolean;
		actionLabel: string;
		showReplacement: boolean;
    onRenameClick?: () => void;
  }

  let {
    query = $bindable(),
    replacement = $bindable(),
		loading,
		actionLabel,
		showReplacement,
    onRenameClick = () => {},
  }: Props = $props();
</script>

<div class="search-replace">
  <TextField placeholder="Find" bind:value={query} focused disabled={loading}>
		{#snippet leadingContent()}
			{@html iconSearch}
		{/snippet}
	</TextField>

	{#if showReplacement}
  	<TextField placeholder="Rename To…" bind:value={replacement} disabled={loading} />
	{/if}

  <button class="rename-button" onclick={onRenameClick} disabled={!replacement || loading}>
		{#if loading}
			<Spinner type="solid" />
		{:else}
			{actionLabel}
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
