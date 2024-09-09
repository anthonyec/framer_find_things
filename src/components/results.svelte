<script lang="ts">
  import type { Result } from "../search/types";

  import * as text from "../utils/text"
  import { fade } from 'svelte/transition';
  import { framer } from "framer-plugin";
  import HighlightRange from "./highlight_range.svelte";
  import PlaceholderResultRow from "./placeholder_result_row.svelte";
  import ResultRow from "./result_row.svelte";
  import VirtualList from "./virtual_list.svelte";
  import RenameComparison from "./rename_comparison.svelte";
  import LayerIcon from "./layer_icon.svelte";
  import PlaceholderRenameComparison from "./placeholder_rename_comparison.svelte";

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
  <VirtualList class="list" entries={results}>
    {#snippet item(result)}
      {#key (result.title, result.ranges)}
        <RenameComparison
          before={result.title}
          after={replacement ? text.replaceAllRanges(
            result.title,
            replacement,
            result.ranges,
            false
          ) : ""}
        >
          <LayerIcon type={result.entry.type} />
        </RenameComparison>
      {/key}
    {/snippet}

    {#snippet trailingContent()}
      {#if indexing && query}
        <div transition:fade={{ duration: 250 }}>
          <PlaceholderRenameComparison index={0} total={5} width={30} />
          <PlaceholderRenameComparison index={1} total={5} width={40} />
          <PlaceholderRenameComparison index={2} total={5} width={20} />
          <PlaceholderRenameComparison index={3} total={5} width={30} />
          <PlaceholderRenameComparison index={4} total={5} width={20} />
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
    display: flex;
    flex-direction: column;
    gap: 1px;
    height: 100%;
    overflow: hidden;
  }

  :global(.list) {
    padding-top: 15px;
  }

  .empty-state {
    color: var(--framer-color-text-tertiary);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
