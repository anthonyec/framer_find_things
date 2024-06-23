<script lang="ts">
	export let checked: boolean = false;
</script>

<div class="toggle-button">
	<input type="checkbox" bind:checked />
	<div class="button">
		<slot></slot>
	</div>
</div>

<style>
	.toggle-button {
		background-color: red;
		width: 30px;
		height: 25px;
		position: relative;
	}

	input {
		position: absolute;
		inset: 0;
		opacity: 0;
		z-index: 2;
	}

	.button {
		user-select: none;
		z-index: 1;
	}
</style>
