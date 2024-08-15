<script lang="ts">
  import type { Result } from "../search/types";

  import IconComponentLayer from "./icon_component_layer.svelte";
  import IconFramerLayer from "./icon_framer_layer.svelte";
  import IconLockedLayer from "./icon_locked_layer.svelte";
  import IconTextLayer from "./icon_text_layer.svelte";

  let {
    selected,
    result,
    onclick,
  }: { selected: boolean, result: Result, onclick: () => void } = $props()
</script>

<button class="result-row" class:selected onclick={onclick}>
  <div class="icon">
    {#if result.entry.type === "text"}
      <IconTextLayer />
    {/if}

    {#if result.entry.type === "frame"}
      <IconFramerLayer />
    {/if}

    {#if result.entry.type === "component"}
      <IconComponentLayer />
    {/if}
  </div>

  <div class="label">
    <slot></slot>
  </div>

  <div class="properties">
    {#if result.entry.locked }
      <IconLockedLayer />
    {/if}
  </div>
</button>

<style>
  .result-row {
    background-color: transparent;
    display: flex;
    width: 100%;
    height: auto;
    align-items: start;
    padding: 8px 8px;
    padding-right: 10px;
    gap: 7px;
    transition: none;
  }

  .result-row.selected {
    background: var(--framer-color-tint);
    color: var(--framer-color-text-reversed);
  }

  .result-row.result-row.selected .icon,
  .result-row.result-row.selected .properties {
    color: var(--framer-color-text-reversed);
  }

  .icon {
    color: var(--framer-color-text-tertiary);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 1lh;
  }

  .label {
    text-align: left;
  }

  .properties {
    color: var(--framer-color-text-tertiary);
    display: flex;
    align-items: center;
    height: 1lh;
    flex-shrink: 0;
    margin-left: auto;
  }
</style>
