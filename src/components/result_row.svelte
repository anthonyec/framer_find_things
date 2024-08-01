<script lang="ts">
  import type { Result } from "../search/types";

  import IconComponentLayer from "./icon_component_layer.svelte";
  import IconFramerLayer from "./icon_framer_layer.svelte";
  import IconLockedLayer from "./icon_locked_layer.svelte";
  import IconTextLayer from "./icon_text_layer.svelte";

  let {
    result,
    onclick,
  }: { onclick: () => void,  result: Result } = $props()
</script>

<button class="result-row" onclick={onclick}>
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
    background: transparent;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
  }

  .icon {
    color: var(--framer-color-text-tertiary);
    width: 11px;
    flex-shrink: 0;
  }

  .label {
    text-align: left;
  }

  .properties {
    color: var(--framer-color-text-tertiary);
    flex-shrink: 0;
    margin-left: auto;
  }
</style>
