<script lang="ts">
  import type { Filter } from "../search/filters";
  import ConfigureCategoryFilter from "./configure_category_filter.svelte";

  let {
    filters = $bindable()
  }: { filters: Filter[] } = $props()

  let openedFilter: Filter | null = $state(null)

  const addFilter = () => {
    filters.push({
      id: "category",
      type: "category",
      category: "all"
    })
  }

  const openFilter = (filter: Filter) => {
    openedFilter = filter
  }
</script>

<div class="filters">
  {#each filters as filter}
    {#if filter.type !== "text"}
      <button class="filter" on:click={() => openFilter(filter)}>{filter.category}</button>
    {/if}
  {/each}

  <button class="add-button" on:click={addFilter}>+</button>
</div>

{#if openedFilter?.type === "category"}
  <ConfigureCategoryFilter bind:filter={openedFilter} />
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

  .add-button {
    width: 30px;
  }
</style>
