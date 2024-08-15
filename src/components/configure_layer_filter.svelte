<script lang="ts">
  import type { LayerFilter } from "../search/filters";

  let {
    filter = $bindable(),
  }: { filter: LayerFilter } = $props()
</script>

<div class="form">
  Locked:
  <input type="checkbox" bind:checked={filter.locked}/>
</div>

<style>
  .form {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
