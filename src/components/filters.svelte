<script lang="ts">
  import type { Filter } from "../search/filters";
  import * as array from "../utils/array";
  import * as text from "../utils/text"
  import ConfigureCategoryFilter from "./configure_category_filter.svelte";

  let {
    filters = $bindable()
  }: { filters: Filter[] } = $props()

  let currentFilter: Filter | null = $state(null)
  let filterIdToElement: Record<Filter["id"], HTMLDivElement> = {}

  let anchor: HTMLDivElement | null = $derived.by(() => {
    console.log("currentFilter")
    if (currentFilter) return filterIdToElement[currentFilter.id]
    return null
  })

  const addFilter = () => {
    filters.push({
      id: text.randomID(),
      type: "category",
      category: "all"
    })
  }

  const openFilter = (filter: Filter) => {
    currentFilter = filter
  }

  const closeFilter = () => {
    currentFilter = null
  }

  const toggleFilter = (filter: Filter) => {
    // Open modal if not already open or clicking on a different filter.
    if (!currentFilter || currentFilter.id !== filter.id) {
      return openFilter(filter)
    }

    // Close if clicking on the same filter.
    closeFilter()
  }

  const removeFilter = (filter: Filter) => {
    currentFilter = null
    filters = array.remove(filters, filter)
  }

</script>

<div class="filters">
  {#each filters as filter}
    {#if filter.type !== "text"}
      <div class="filter" class:open={currentFilter?.id === filter.id}>
        <button class="filter" onclick={() => toggleFilter(filter)}>{text.capitalize(filter.category)}</button>
        <button class="delete-button" onclick={() => removeFilter(filter)}>X</button>
      </div>
    {/if}
  {/each}

  <button class="add-button" onclick={addFilter}>+</button>
</div>

{#if currentFilter?.type === "category"}
  <ConfigureCategoryFilter bind:filter={currentFilter} />
{/if}

<style>
  .filters {
    display: flex;
    gap: 4px;
    overflow-x: scroll;
  }

  .filter {
    border-radius: 100px;
    background: gray;
    padding: 3px 8px;
    flex-shrink: 0;
    align-content: center;
    width: auto;
  }

  .filter.open {
    background: red;
  }

  .add-button {
    width: 30px;
  }

  .delete-button {
    width: 30px;
    height: 30px;
  }
</style>
