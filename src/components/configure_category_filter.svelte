<script lang="ts">
  import type { CategoryFilter } from "../search/filters";

  import FilterModal from "./filter_modal.svelte";

  let {
    filter = $bindable()
  }: { filter: CategoryFilter } = $props()

  const selectCategory = (category: CategoryFilter["category"]) => {
    filter.category = category
  }
</script>

<FilterModal>
  <button on:click={() => selectCategory("all")}>All</button>
  <button on:click={() => selectCategory("frame")}>Frame</button>
</FilterModal>
