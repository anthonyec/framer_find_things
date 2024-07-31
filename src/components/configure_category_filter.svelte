<script lang="ts">
  import type { CategoryFilter } from "../search/filters";

  import { categories } from "../search/filters"
  import * as text from "../utils/text"
  import FilterModal from "./filter_modal.svelte";
  import IconCheckmark from "./icon_checkmark.svelte";

  let {
    filter = $bindable(),
  }: { filter: CategoryFilter } = $props()

  const selectCategory = (category: CategoryFilter["category"]) => {
    filter.category = category
  }
</script>

<FilterModal>
  {#each categories as category}
    <button onclick={() => selectCategory(category)} class:selected={filter.category === category}>
      <div class="checkmark">
        {#if filter.category === category}
          <IconCheckmark />
        {/if}
      </div>

      {text.capitalize(category)}
    </button>
  {/each}
</FilterModal>

<style>
  button {
    background: transparent;
    display: flex;
    align-items: center;
    transition: none;
    gap: 8px;
    padding-right: 16px;
  }

  button:hover {
    background: var(--framer-color-tint);
    color: var(--framer-color-text-reversed)
  }

  .checkmark {
    width: 12px;
    transform: translateY(1px);
  }
</style>
