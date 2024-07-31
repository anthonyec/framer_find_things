<script lang="ts">
  import type { Filter } from "../search/filters";
  import * as array from "../utils/array";
  import * as text from "../utils/text"
  import ConfigureCategoryFilter from "./configure_category_filter.svelte";
  import IconClose from "./icon_close.svelte";
  import IconPlus from "./icon_plus.svelte";

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

<div class="filters-container">
  <div class="filters">
    {#each filters as filter}
      {#if filter.type !== "text"}
        <div class="filter" class:open={currentFilter?.id === filter.id}>
          <button class="open-button" onclick={() => toggleFilter(filter)}>{text.capitalize(filter.category)}</button>
          <button class="delete-button" onclick={() => removeFilter(filter)}><IconClose /></button>
        </div>
      {/if}
    {/each}
  </div>

  <button class="add-button" onclick={addFilter}>
    <IconPlus />
  </button>
</div>

{#if currentFilter?.type === "category"}
  <ConfigureCategoryFilter bind:filter={currentFilter} />
{/if}

<style>
  button {
    border-radius: 0;
    background: transparent;
    padding: 0;
    margin: 0;
    width: auto;
    height: 100%;
  }

  button:active, button:focus {
    background: transparent;

  }

  .filters-container {
    display: flex;
    align-items: center;
    padding: 1px 10px 9px;
    gap: 5px;
    overflow-x: scroll;
  }

  .filters {
    display: flex;
    gap: 8px;
  }

  .filter {
    border-radius: 4px;
    background: var(--framer-color-bg);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: flex;
    height: 23px;
    flex-shrink: 0;
    align-content: center;
    width: auto;
    overflow: hidden;
  }

  .filter.open {
    background: var(--framer-color-tint-dimmed);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--framer-color-tint);
  }

  :global([data-framer-theme="dark"]) .filter {
    background: rgba(255, 255, 255, 0.2);
  }

  :global([data-framer-theme="dark"]) .filter.open {
    background: rgba(255, 255, 255, 0.1);
  }

  .open-button {
    display: flex;
    align-items: center;
    padding: 0 8px;
    padding-right: 1px;
  }

  .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 23px;
  }

  .delete-button {
    color: var(--framer-color-text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
  }
</style>
