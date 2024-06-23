<script lang="ts">
	import ToggleButton from './toggle_button.svelte';

	let isCaseSensitive: boolean = false;
</script>

<div class="search-replace">
	<div class="row">
		<input type="text" />
		<div class="actions">
			<ToggleButton bind:checked={isCaseSensitive}>Aa</ToggleButton>
			<ToggleButton>.*</ToggleButton>
		</div>
	</div>
	<div class="row">
		<input type="text" />
		<div class="actions">
			<ToggleButton bind:checked={isCaseSensitive}>AB</ToggleButton>
		</div>
	</div>
</div>

<style>
	.search-replace {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.row {
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
