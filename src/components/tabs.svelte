<script lang="ts">
  interface Props {
    active: string;
    items: string[];
  }

  let { active, items }: Props = $props();
</script>

<div class="tabs">
  {#each items as item}
    <div class="tab" class:active={item === active}>{item}</div>
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
    color: var(--framer-color-text-tertiary);
    font-weight: 600;
  }

  .tab.active {
    color: var(--framer-color-text);
  }
</style>
