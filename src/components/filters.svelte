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
  import { getCategoryFilterLabel, getLayerFilterLabel, getSizeFilterLabel } from "../search/filter_labels";
  import ConfigureLayerFilter from "./configure_layer_filter.svelte";
  import type { SvelteComponent } from "svelte";

  let {
    filters = $bindable()
  }: { filters: Filter[] } = $props()

  let currentFilter: Filter | null = $state(null)
  let isAddMenuOpen: boolean = $state(false)

  let addButtonElement = $state<HTMLElement>()
  let chipElements = $state<Record<Filter["id"], HTMLDivElement>>({})

  // let anchor: HTMLDivElement | null = $derived.by(() => {
  //   if (currentFilter) return filterIdToElement[currentFilter.id]
  //   return null
  // })

  $inspect("chipElements", chipElements)

  const addFilter = (type: Filter["type"]) => {
    const id = text.randomID()

    let filter: Filter | undefined

    switch(type) {
      case "category":
        filter = {
          id,
          type: "category",
          category: "all"
        }
        break

      case "size":
        filter = {
          id,
          type: "size",
          comparator: ">",
          width: 300,
          height: 200,
        }
        break

      case "layer":
        filter = {
          id,
          type: "layer",
          hidden: false,
          locked: false,
        }
        break

      case "text":
        // TODO(anthony): Should not be possible, throw an assert!
        break

      default:
        assertNever(type)
    }

    if (!filter) return

    filters.push(filter)

    isAddMenuOpen = false
    currentFilter = filter
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

  /**
   * Open modal if not already open or clicking on a different filter. Close if
   * clicking on the same filter.
   * */
  const toggleFilter = (filter: Filter) => {
    if (!currentFilter || currentFilter.id !== filter.id) {
      return openFilter(filter)
    }

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
        <FilterChip id={filter.id} open={filter.id === currentFilter?.id} onClick={() => toggleFilter(filter)} onRemoveClick={() => removeFilter(filter)}>
          {#if filter.type === "category"}
            {getCategoryFilterLabel(filter)}
          {/if}

          {#if filter.type === "size"}
            {getSizeFilterLabel(filter)}
          {/if}

          {#if filter.type === "layer"}
            {getLayerFilterLabel(filter)}
          {/if}
        </FilterChip>
      {/if}
    {/each}
  </div>

  <button id="add-button" class="add-button" onmousedown={openAddMenu}>
    <IconPlus />
  </button>
</div>

{#if currentFilter?.type === "category"}
  <ConfigureCategoryFilter bind:filter={currentFilter} />
{/if}

{#if currentFilter?.type === "size"}
  <ConfigureSizeFilter bind:filter={currentFilter} />
{/if}

{#if currentFilter?.type === "layer"}
  <ConfigureLayerFilter bind:filter={currentFilter} />
{/if}

{#if isAddMenuOpen}
  <Popup target={addButtonElement}>
    <MenuItems
      items={[
        { id: "category", label: "Category", action: () => addFilter("category") },
        { id: "size", label: "Size", action: () => addFilter("size") },
        { id: "layer", label: "Layer", action: () => addFilter("layer") }
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

  .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 23px;
  }
</style>
