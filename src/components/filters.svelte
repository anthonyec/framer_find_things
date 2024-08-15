<script lang="ts">
  import type { Filter } from "../search/filters";

  import * as array from "../utils/array";
  import * as text from "../utils/text"
  import * as color from "../utils/color"
  import { assertNever } from "../utils/assert";
  import ConfigureCategoryFilter from "./configure_category_filter.svelte";
  import ConfigureSizeFilter from "./configure_size_filter.svelte";
  import FilterChip from "./filter_chip.svelte";
  import IconPlus from "./icon_plus.svelte";
  import MenuItems from "./menu_items.svelte";
  import Popup from "./popup.svelte";
  import { getCategoryFilterLabel, getColorFilterLabel, getLayerFilterLabel, getSizeFilterLabel } from "../search/filter_labels";
  import ConfigureLayerFilter from "./configure_layer_filter.svelte";
  import ConfigureColorFilter from "./configure_color_filter.svelte";
  import { getPopup } from "./popup_context.svelte";

  let {
    filters = $bindable()
  }: { filters: Filter[] } = $props()

  const popup = getPopup()

  let currentFilter: Filter | null = $state(null)

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

      case "color":
        filter = {
          id,
          type: "color",
          color: color.createColorRGBA(242, 59, 57, 1),
          distance: 50
        }
        break

      case "text":
        // TODO(anthony): Should not be possible, throw an assert!
        break

      default:
        assertNever(type)
    }

    if (!filter) return

    currentFilter = filter

    filters.push(filter)
    popup.open(filter.id)
  }

  const openFilter = (filter: Filter) => {
    currentFilter = filter
    popup.open(filter.id)
  }

  const closeFilter = () => {
    currentFilter = null
    popup.close()
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
    filters = array.remove(filters, filter)

    popup.close()
  }
</script>

<div class="filters-container">
  <div class="filters">
    {#each filters as filter}
      {#if filter.type !== "text"}
        <FilterChip id={filter.id} open={popup.isOpen(filter.id)} onClick={() => toggleFilter(filter)} onRemoveClick={() => removeFilter(filter)}>
          {#if filter.type === "category"}
            {getCategoryFilterLabel(filter)}
          {/if}

          {#if filter.type === "size"}
            {getSizeFilterLabel(filter)}
          {/if}

          {#if filter.type === "layer"}
            {getLayerFilterLabel(filter)}
          {/if}

          {#if filter.type === "color"}
            {getColorFilterLabel(filter)}
          {/if}
        </FilterChip>
      {/if}
    {/each}
  </div>

  <button id="add-button" class="add-button" onmousedown={() => popup.open("add-menu")}>
    <IconPlus />
  </button>
</div>

{#if popup.isOpen(currentFilter?.id)}
  <Popup target={addButtonElement} onDismiss={closeFilter}>
    {#if currentFilter?.type === "category"}
      <ConfigureCategoryFilter bind:filter={currentFilter} onConfigured={closeFilter} />
    {/if}

    {#if currentFilter?.type === "size"}
      <ConfigureSizeFilter bind:filter={currentFilter} />
    {/if}

    {#if currentFilter?.type === "layer"}
      <ConfigureLayerFilter bind:filter={currentFilter} />
    {/if}

    {#if currentFilter?.type === "color"}
      <ConfigureColorFilter bind:filter={currentFilter} />
    {/if}
  </Popup>
{/if}

{#if popup.isOpen("add-menu")}
  <Popup target={addButtonElement} onDismiss={popup.close}>
    <MenuItems
      items={[
        { id: "category", label: "Category", action: () => addFilter("category") },
        { id: "size", label: "Size", action: () => addFilter("size") },
        { id: "layer", label: "Layer", action: () => addFilter("layer") },
        { id: "color", label: "Color", action: () => addFilter("color") },
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
