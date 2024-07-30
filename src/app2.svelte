<script lang="ts">
  import type { Filter, TextFilter } from "./search/filters";
  import { executeFilters } from "./testExecuteFilters";

  const index = [
		"hello",
		"wow",
		"foo",
		"hello foo"
	]

  const createResultsState = () => {
    let results: string[] = $state([])

    return {
      get value() {
        return results
      },

      async update(filters: Filter[]) {
        results = await executeFilters(filters, index)
      }
    }
  }

  let textSearchFilter: TextFilter = $state({
    id: "text-search",
    type: "text",
    query: "",
    caseSensitive: false,
    regex: false,
  })

  let filters: Filter[] = $state([textSearchFilter])
  let results = createResultsState()

  $effect(() => {
    results.update(filters)
  })
</script>


<pre>
{JSON.stringify(filters, null, 2)}
</pre>

<input type="text" bind:value={textSearchFilter.query}>

{#each filters as filter}
  {filter.id}
{/each}

{#each results.value as result}
  <div>
    {result}
  </div>
{/each}
