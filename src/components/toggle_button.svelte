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
		cursor: pointer;
		width: 30px;
		height: 25px;
		position: relative;
	}

	.toggle-button:focus-within {
		outline: 1px solid green;
	}

	input[type="checkbox"] {
		cursor: pointer;
		position: absolute;
		border-radius: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		z-index: 2;
	}

	input[type="checkbox"]:checked + .button {
		background: blue;
	}

	.button {
		background: red;
		user-select: none;
		pointer-events: none;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
