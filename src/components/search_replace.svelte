<script lang="ts">
	import ToggleButton from './toggle_button.svelte';

	interface Props {
		query: string;
		caseSensitive: boolean;
		regex: boolean;
		searchProject: boolean
		replacement: string;
		preserveCase: boolean;
		onReplaceAllClick?: () => void;
		onNavigate?: (direction: number) => void;
	}

	let {
		query = $bindable(),
		caseSensitive = $bindable(),
		regex = $bindable(),
		replacement = $bindable(),
		preserveCase  = $bindable(),
		searchProject = $bindable(),
		onReplaceAllClick = () => {},
		onNavigate
	}: Props = $props()

	let searchInput: HTMLInputElement
	let additionalFilters: boolean = $state(false);

	$effect(() => {
		searchInput.focus()
	})

	const handleSearchKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault()

			const direction = event.key === "ArrowUp" ? -1 : 1
			onNavigate?.(direction)
		}
	}
</script>

<div class="search-replace">
	<div class="text-input-group">
		<div class="text-input">
			<input type="text" placeholder="Search" bind:this={searchInput} bind:value={query} onkeydown={handleSearchKeyDown}/>

			<div class="actions">
				<ToggleButton label="Match Case" bind:checked={caseSensitive}>Aa</ToggleButton>
				<ToggleButton label="Use Regular Expression" bind:checked={regex}>.*</ToggleButton>
				<!-- <ToggleButton label="Search Whole Project" bind:checked={searchProject}>S</ToggleButton> -->
			</div>
		</div>

		{#if additionalFilters}
			<div>
				<slot name="additional-filters" />
			</div>
		{/if}
	</div>

	<div class="text-input">
		<input type="text" placeholder="Replace" bind:value={replacement} />

		<div class="actions">
			<ToggleButton label="Preserve Case" bind:checked={preserveCase}>AB</ToggleButton>
		</div>
	</div>

	<button onclick={onReplaceAllClick} disabled={!replacement}>Replace All</button>
</div>

<style>
	.search-replace {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;
		padding-top: 0;
	}

	.text-input-group {
		background: var(--framer-color-bg-tertiary);
		border-radius: 8px;
	}

	.text-input-group:focus-within {
		box-shadow: 0 0 0 1px var(--framer-color-tint) inset;
	}

	.text-input-group:focus-within input {
		background-color: transparent;
	}

	.text-input-group:focus-within input:focus {
		box-shadow: none;
	}

	.text-input {
		display: flex;
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
		gap: 4px;
		padding-right: 4px;
	}
</style>
