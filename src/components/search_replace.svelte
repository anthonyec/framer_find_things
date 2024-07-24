<script lang="ts">
	import { onMount } from 'svelte'

	import ToggleButton from './toggle_button.svelte';

	export let query: string;
	export let caseSensitive: boolean;
	export let regex: boolean;

	export let replacement: string;
	export let preserveCase: boolean;

	export let onReplaceAllClick: () => void;

	let searchInput: HTMLInputElement
	let additionalFilters: boolean;

	onMount(() => searchInput.focus())
</script>

<div class="search-replace">
	<div class="text-input">
		<input type="text" placeholder="Search" bind:this={searchInput} bind:value={query} />

		<div class="actions">
			<ToggleButton bind:checked={caseSensitive}>Aa</ToggleButton>
			<ToggleButton bind:checked={regex}>.*</ToggleButton>
			<ToggleButton bind:checked={additionalFilters}>⚙️</ToggleButton>
		</div>

		{#if additionalFilters}
			<slot name="additional-filters" />
		{/if}
	</div>

	<div class="text-input">
		<input type="text" placeholder="Replace" bind:value={replacement} />

		<div class="actions">
			<ToggleButton bind:checked={preserveCase}>AB</ToggleButton>
		</div>
	</div>

	<button on:click={onReplaceAllClick} disabled={!replacement}>Replace All</button>
</div>

<style>
	.search-replace {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;
		padding-top: 0;
	}

	.text-input {
		position: relative;
	}

	input {
		width: 100%;
	}

	.actions {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 0 8px;
	}
</style>
