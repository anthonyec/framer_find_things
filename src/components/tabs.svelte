<script lang="ts">
  interface TabItem {
    label: string;
    active: () => boolean;
    select: () => void;
  }

  interface Props {
    items: TabItem[];
  }

  let { items }: Props = $props();
</script>

<div class="tabs">
  {#each items as item}
    <button class="tab" class:active={item.active()} onclick={item.select}>
      {item.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 52px;
    flex-shrink: 0;
    border-top: 1px solid var(--framer-color-divider);
    border-bottom: 1px solid var(--framer-color-divider);
  }

  .tab {
    background: none;
    border: 0;
    width: auto;
    padding: 0;
    color: var(--framer-color-text-tertiary);
    font-weight: 600;
    user-select: none;
  }

  .tab.active {
    color: var(--framer-color-text);
  }
</style>
