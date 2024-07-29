<script lang="ts">
  import type { CategoryFilter } from "../search/filters";

  import { categories } from "../search/filters"
  import * as text from "../utils/text"
  import FilterModal from "./filter_modal.svelte";

  let {
    filter = $bindable(),
  }: { filter: CategoryFilter } = $props()

  const selectCategory = (category: CategoryFilter["category"]) => {
    filter.category = category
  }
</script>

<FilterModal>
  {#each categories as category}
    <button onclick={() => selectCategory(category)} class:selected={category === filter.category}>{text.capitalize(category)}</button>
  {/each}
</FilterModal>

<style>
  .selected {
    background: red
  }
</style>
