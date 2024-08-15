
<script lang="ts">
  import type { CategoryFilter, Filter, SizeFilter, LayerFilter, ColorFilter } from "../search/filters"

  import * as text from "../utils/text"
  import * as color from "../utils/color"
  import * as array from "../utils/array"
  import { isCategoryFilter, isColorFilter, isLayerFilter, isSizeFilter, isTextFilter } from "../search/filters";
  import ConfigureCategoryFilter from "./configure_category_filter.svelte";
  import ConfigureColorFilter from "./configure_color_filter.svelte";
  import ConfigureLayerFilter from "./configure_layer_filter.svelte";
  import ConfigureSizeFilter from "./configure_size_filter.svelte";
  import IconClose from "./icon_close.svelte";
  import { assert, assertNever } from "../utils/assert";
  import Popup from "./popup.svelte";
  import MenuItems from "./menu_items.svelte";

  let {
    filters = $bindable()
  }: { filters: Filter[] } = $props()

  let showAddMenu: boolean = $state(false)

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
        assert(false, "Should not be able to add text filter manually")
        break

      default:
        assertNever(type)
    }

    if (!filter) return

    filters.push(filter)
    showAddMenu = false
  }

  const removeFilter = (filter: Filter) => {
    showAddMenu = false

    filters = array.remove(filters, filter)
  }

  const openAddMenu = () => {
    showAddMenu = true
  }
</script>

<div class="sidebar">
  {#each filters as filter, index}
    {#if !isTextFilter(filter)}
      <div class="filter" tabindex={index} role="button">
        <button class="delete-button floating" onclick={() => removeFilter(filter)}><IconClose /></button> <!-- TODO(anthony): Combine into one class. -->

        {#if isCategoryFilter(filter)}
          <ConfigureCategoryFilter bind:filter={filters[index] as CategoryFilter} onConfigured={() => {}} /> <!-- TODO(anthony): Work out how to make this type safe. Technically it should be. -->
        {/if}

        {#if isSizeFilter(filter)}
          <ConfigureSizeFilter bind:filter={filters[index] as SizeFilter} />
        {/if}

        {#if isLayerFilter(filter)}
          <ConfigureLayerFilter bind:filter={filters[index] as LayerFilter} />
        {/if}

        {#if isColorFilter(filter)}
          <ConfigureColorFilter bind:filter={filters[index] as ColorFilter} />
        {/if}
        </div>
      {/if}
    {/each}

    <div class="actions">
      <button onclick={openAddMenu}>Add Filter</button>
    </div>

    {#if showAddMenu}
      <Popup>
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
</div>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    gap: 12px;
    height: 100%;
  }

  .actions {
    padding-bottom: 8px;
    margin-top: auto;
  }

  .filter {
    background: var(--framer-color-bg);
    /* box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1); */
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    position: relative;
  }

  :global([data-framer-theme="dark"]) .filter {
    box-shadow: 0 0 0 1px #2E2E2E;
  }

  .filter:focus-within {
    /* box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--framer-color-tint); */
    box-shadow: 0 0 0 1px var(--framer-color-tint);
  }

  .filter:focus-within .delete-button {
    background: var(--framer-color-tint);
    color: var(--framer-color-text-reversed);
    box-shadow: none;
  }

  .filter h3 {
    color: var(--framer-color-text-secondary);
    font-size: 12px;
    font-weight: 600;
    padding: 7px 8px 0;
  }

  .title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-bar .delete-button {
    width: 30px;
  }

  .delete-button {
    background-color: transparent;
    color: var(--framer-color-text-tertiary);
    /* width: 30px; */
    flex-flow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: 0;
  }

  :global([data-framer-theme="dark"]) .delete-button {
    box-shadow: 0 0 0 1px #2E2E2E;
  }

  .filter:hover .floating {
    display: flex;
  }

  .floating {
    background: var(--framer-color-bg);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    display: none;
    position: absolute;
    right: -8px;
    top: -8px;
    width: 18px;
    height: 18px;
  }
</style>
