<script lang="ts">
  import type { Result } from "../search/types";
  import HighlightRange from "./highlight_range.svelte";
  import PlaceholderResultRow from "./placeholder_result_row.svelte";
  import ResultRow from "./result_row.svelte";

  interface Props {
    query: string;
    replacement: string;
    indexing: boolean;
    results: Result[];
    selectedNodeIds: string[];
    onFocusResult: (result: Result) => void;
  }

  let {
    query,
    replacement,
    indexing,
    results,
    selectedNodeIds,
    onFocusResult,
  }: Props = $props();
</script>

<div class="results">
  {#each results as result ((result.title, result.ranges))}
    <ResultRow
      selected={selectedNodeIds.includes(result.id)}
      {result}
      onclick={() => onFocusResult(result)}
    >
      <HighlightRange
        title={result.title}
        ranges={result.ranges}
        {replacement}
        selected={selectedNodeIds.includes(result.id)}
      />
    </ResultRow>
  {/each}

  {#if indexing && query}
    <PlaceholderResultRow index={0} total={5} width={30} />
    <PlaceholderResultRow index={1} total={5} width={50} />
    <PlaceholderResultRow index={2} total={5} width={20} />
    <PlaceholderResultRow index={3} total={5} width={70} />
    <PlaceholderResultRow index={4} total={5} width={20} />
  {/if}

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
    margin: 0 8px;
    padding-bottom: 8px;
    overflow-y: scroll;
  }

  .info {
    color: var(--framer-color-text-tertiary);
    border-top: 1px solid var(--framer-color-divider);
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 42px;
    flex-shrink: 0;
    user-select: none;
  }

  .count {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .empty-state {
    color: var(--framer-color-text-tertiary);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
