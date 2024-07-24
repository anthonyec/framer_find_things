<script lang="ts">
  	import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<button class="result-row" on:click={() => dispatch("click")}>
  <slot></slot>
</button>

<style>
  .result-row {
    background: transparent;
    display: block;
    width: 100%;
    text-align: left;
  }
</style>
