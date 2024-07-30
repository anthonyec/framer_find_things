<script lang="ts">
	import ToggleButton from './toggle_button.svelte';

	interface Props {
		query: string;
		caseSensitive: boolean;
		regex: boolean;
		replacement: string;
		preserveCase: boolean;
		onReplaceAllClick?: () => void;
	}

	let {
		query = $bindable(),
		caseSensitive = $bindable(),
		regex = $bindable(),
		replacement = $bindable(),
		preserveCase  = $bindable(),
		onReplaceAllClick = () => {}
	}: Props = $props()

	let searchInput: HTMLInputElement
	let additionalFilters: boolean = $state(false);

	$effect(() => {
		searchInput.focus()
	})
</script>

<div class="search-replace">
	<div class="text-input">
		<input type="text" placeholder="Search" bind:this={searchInput} bind:value={query} />

		<div class="actions">
			<ToggleButton label="Match Case" bind:checked={caseSensitive}>Aa</ToggleButton>
			<ToggleButton label="Use Regular Expression" bind:checked={regex}>.*</ToggleButton>
			<ToggleButton label="Use Filters" bind:checked={additionalFilters}>⚙️</ToggleButton>
		</div>

		{#if additionalFilters}
			<slot name="additional-filters" />
		{/if}
	</div>

	<div class="text-input">
		<input type="text" placeholder="Replace" bind:value={replacement} />

		<div class="actions">
			<ToggleButton label="Preserve Case" bind:checked={preserveCase}>AB</ToggleButton>
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
		align-items: flex-start;
		gap: 5px;
		padding: 0 8px;
	}
</style>
