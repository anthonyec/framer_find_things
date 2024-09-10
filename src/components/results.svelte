<script lang="ts">
  import type { Result } from "../search/types";
  import type { RenamerMode } from "../app.svelte";

  import { fade } from 'svelte/transition';
  import { framer } from "framer-plugin";
  import VirtualList from "./virtual_list.svelte";
  import RenameComparison from "./rename_comparison.svelte";
  import LayerIcon from "./layer_icon.svelte";
  import PlaceholderRenameComparison from "./placeholder_rename_comparison.svelte";

  interface Props {
    query: string;
    indexing: boolean;
    results: Result[];
    selectedNodeIds: string[];
    getTextAfterRename: (result: Result) => string
  }

  let { query, indexing, results, getTextAfterRename }: Props = $props();

</script>

<div class="results">
  <VirtualList entries={results} paddingTop={15}>
    {#snippet item(result, index)}
      {#key (result.title, result.ranges)}
        <RenameComparison
          before={result.title}
          after={getTextAfterRename(result)}
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

  {#if results.length === 0 && query && !indexing}
    <div class="empty-state">
      No results
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

  .empty-state {
    color: var(--framer-color-text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
  }
</style>
