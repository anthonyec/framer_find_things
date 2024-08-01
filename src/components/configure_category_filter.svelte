<script lang="ts">
  import type { CategoryFilter } from "../search/filters";

  import { categories } from "../search/filters"
  import * as text from "../utils/text"
  import Popup from "./popup.svelte";
  import MenuItems from "./menu_items.svelte";
  import { replaceAll } from "../search/replace_all";

  let {
    filter = $bindable(),
  }: { filter: CategoryFilter } = $props()

  const selectCategory = (category: CategoryFilter["category"]) => {
    filter.category = category
  }

  console.log(filter.category)
</script>

<Popup title="Type">
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
</Popup>
