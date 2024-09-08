<script lang="ts" generics="Entry">
  import type { Snippet } from "svelte";

  interface Props {
    item: Snippet<[Entry]>;
    entries: Entry[];
    height?: number;
    trailingContent?: Snippet
  }

  let { item, entries, height = 30, trailingContent }: Props = $props();

  let containerHeight = $derived(height * entries.length);

  let viewportHeight = $state(0)
  let totalViewportPages = $derived(Math.max(Math.floor(containerHeight / viewportHeight), 0))
  let itemsPerPage = $derived(Math.ceil(viewportHeight / height))
  let pageHeight = $derived(itemsPerPage * height)
  let currentPage = $state(0)
  let remainingPages = $state(0)

  let currentPageEntries = $derived(entries.slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage))
  let nextPageEntries = $derived(entries.slice((currentPage + 1) * itemsPerPage, ((currentPage + 1) * itemsPerPage) + itemsPerPage))

  const scroll = (event: UIEvent) => {
    if (!(event.currentTarget instanceof HTMLDivElement)) return;

    const scrollTop = event.currentTarget.scrollTop;

    currentPage = Math.floor(scrollTop / pageHeight)
    remainingPages = totalViewportPages - currentPage
  };

  $inspect(pageHeight)
</script>

<div class="virtual-list" onscroll={scroll} bind:offsetHeight={viewportHeight}>
  <div class="container" style:height={`${pageHeight}px`} style:padding-top={`${currentPage * pageHeight}px`} style:padding-bottom={`${remainingPages * pageHeight}px`}>
    {#each currentPageEntries as entry}
      <div class="entry">
        {@render item(entry)}
      </div>
    {/each}

    {#each nextPageEntries as entry}
      <div class="entry">
        {@render item(entry)}
      </div>
    {/each}

    {@render trailingContent?.()}
  </div>
</div>

<style>
  .virtual-list {
    height: 100%;
    overflow-y: scroll;
  }
</style>
