<script lang="ts">
  import type { ColorFilter } from "../search/filters";

  let {
    filter = $bindable(),
  }: { filter: ColorFilter } = $props()
</script>

<div class="form">

  <input bind:value={filter.color.r} type="range" min="0" max="255" />
  <input bind:value={filter.color.g} type="range" min="0" max="255" />
  <input bind:value={filter.color.b} type="range" min="0" max="255" />
  <input bind:value={filter.color.a} type="range" min="0" max="255" />

  <input bind:value={filter.distance} type="range" min="0" max="420" />
</div>

<style>
  .form {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
