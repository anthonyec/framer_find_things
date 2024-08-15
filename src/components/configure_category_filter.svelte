<script lang="ts">
  import type { CategoryFilter } from "../search/filters";

  import { categories } from "../search/filters"
  import * as text from "../utils/text"
  import MenuItems from "./menu_items.svelte";

  let {
    filter = $bindable(),
    onConfigured,
  }: { filter: CategoryFilter, onConfigured: () => void } = $props()

  const selectCategory = (category: CategoryFilter["category"]) => {
    filter.category = category
    onConfigured()
  }
</script>

<MenuItems
  items={categories.map((category) => {
    return {
      id: category,
      label: text.capitalize(category).replaceAll("-", " "),
      selected: filter.category === category,
      action: () => selectCategory(category)
    }
  })}
/>

