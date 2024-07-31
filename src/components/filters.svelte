<script lang="ts">
  import type { Filter } from "../search/filters";

  import * as array from "../utils/array";
  import * as text from "../utils/text"
  import { assertNever } from "../utils/assert";
  import ConfigureCategoryFilter from "./configure_category_filter.svelte";
  import ConfigureSizeFilter from "./configure_size_filter.svelte";
  import FilterChip from "./filter_chip.svelte";
  import IconPlus from "./icon_plus.svelte";
  import MenuItems from "./menu_items.svelte";
  import Popup from "./popup.svelte";
  import { getCategoryFilterLabel, getSizeFilterLabel } from "../search/filter_labels";

  let {
    filters = $bindable()
  }: { filters: Filter[] } = $props()

  let currentFilter: Filter | null = $state(null)
  let isAddMenuOpen: boolean = $state(false)

  let filterIdToElement: Record<Filter["id"], HTMLDivElement> = {}

  let anchor: HTMLDivElement | null = $derived.by(() => {
    if (currentFilter) return filterIdToElement[currentFilter.id]
    return null
  })

  const addFilter = (type: Filter["type"]) => {
    switch(type) {
      case "category":
        filters.push({
          id: text.randomID(),
          type: "category",
          category: "all"
        })
        break

      case "size":
        filters.push({
          id: text.randomID(),
          type: "size",
          comparator: ">",
          width: 300,
          height: 200,
        })
        break

      case "text":
        break

      default:
        assertNever(type)
    }

    isAddMenuOpen = false
  }

  const openAddMenu = () => {
    isAddMenuOpen = true
    currentFilter = null
  }

  const openFilter = (filter: Filter) => {
    currentFilter = filter
    isAddMenuOpen = false
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
    isAddMenuOpen = false

    filters = array.remove(filters, filter)
  }
</script>

<div class="filters-container">
  <div class="filters">
    {#each filters as filter}
      {#if filter.type !== "text"}
        <FilterChip open={filter.id === currentFilter?.id} onClick={() => toggleFilter(filter)} onRemoveClick={() => removeFilter(filter)}>
          {#if filter.type === "category"}
            {getCategoryFilterLabel(filter)}
          {/if}

          {#if filter.type === "size"}
            {getSizeFilterLabel(filter)}
          {/if}
        </FilterChip>
      {/if}
    {/each}
  </div>

  <button class="add-button" onmousedown={openAddMenu}>
    <IconPlus />
  </button>
</div>

{#if currentFilter?.type === "category"}
  <ConfigureCategoryFilter bind:filter={currentFilter} />
{/if}

{#if currentFilter?.type === "size"}
  <ConfigureSizeFilter bind:filter={currentFilter} />
{/if}

{#if isAddMenuOpen}
  <Popup>
    <MenuItems
      items={[
        { id: "category", label: "Category", action: () => addFilter("category") },
        { id: "size", label: "Size", action: () => addFilter("size") }
      ]}
    />
  </Popup>
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
