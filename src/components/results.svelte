<script lang="ts">
  import type { Result } from "../search/types";

  import { fade } from 'svelte/transition';
  import { framer } from "framer-plugin";
  import HighlightRange from "./highlight_range.svelte";
  import PlaceholderResultRow from "./placeholder_result_row.svelte";
  import ResultRow from "./result_row.svelte";
  import VirtualList from "./virtual_list.svelte";

  interface Props {
    query: string;
    replacement: string;
    indexing: boolean;
    results: Result[];
    selectedNodeIds: string[];
  }

  let { query, replacement, indexing, results, selectedNodeIds }: Props =
    $props();

  const focusResult = async (result: Result) => {
    await framer.setSelection(result.id);
    await framer.zoomIntoView(result.id, { maxZoom: 1 });
  };
</script>

<div class="results">
  <VirtualList entries={results}>
    {#snippet item(result)}
      {#key (result.title, result.ranges)}
        <ResultRow
          selected={selectedNodeIds.includes(result.id)}
          {result}
          onclick={() => focusResult(result)}
        >
          <HighlightRange
            title={result.title}
            ranges={result.ranges}
            {replacement}
            selected={selectedNodeIds.includes(result.id)}
          />
        </ResultRow>
        {/key}
      {/snippet}

      {#snippet trailingContent()}
        {#if indexing && query}
          <div transition:fade={{ duration: 250 }}>
            <PlaceholderResultRow index={0} total={5} width={30} />
            <PlaceholderResultRow index={1} total={5} width={50} />
            <PlaceholderResultRow index={2} total={5} width={20} />
            <PlaceholderResultRow index={3} total={5} width={70} />
            <PlaceholderResultRow index={4} total={5} width={20} />
          </div>
        {/if}
      {/snippet}
  </VirtualList>

  {#if results.length === 0 && query}
    <div class="empty-state">
      {#if !indexing}
        No results
      {/if}
    </div>
  {/if}
</div>

<style>
  .results {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1px;
    height: 100%;
    overflow: hidden;
  }

  .empty-state {
    color: var(--framer-color-text-tertiary);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
