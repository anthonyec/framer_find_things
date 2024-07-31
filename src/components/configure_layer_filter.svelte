<script lang="ts">
  import type { LayerFilter } from "../search/filters";

  import Popup from "./popup.svelte";

  let {
    filter = $bindable(),
  }: { filter: LayerFilter } = $props()
</script>

<Popup title="Size">
  <div class="form">
    Locked:
    <input type="checkbox" bind:checked={filter.locked}/>
  </div>
</Popup>

<style>
  .form {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
