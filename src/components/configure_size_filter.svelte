<script lang="ts">
  import type { Comparator, SizeFilter } from "../search/filters";

  import { comparators } from "../search/filters";
  import Popup from "./popup.svelte";

  let {
    filter = $bindable(),
  }: { filter: SizeFilter } = $props()

  const comparatorNames: Record<Comparator, string> = {
    "<": "Smaller than",
    ">": "Bigger than",
    "=": "Exactly is",
    "~=": "Kinda is"
  }
</script>

<Popup title="Size">
  <div class="form">
    <select bind:value={filter.comparator}>
      {#each comparators as comparator}
        <option value={comparator}>{comparatorNames[comparator]}</option>
      {/each}
    </select>

    <div class="size-inputs">
      <input type="number" placeholder="Width" bind:value={filter.width} />
      <input type="number" placeholder="Height" bind:value={filter.height} />
    </div>
  </div>
</Popup>

<style>
  select {
    border-radius: 4px;
    width: 100%;
  }

  input {
    border-radius: 4px;
    width: 80px;
  }

  .form {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .size-inputs {
    display: flex;
    gap: 8px;
  }
</style>
