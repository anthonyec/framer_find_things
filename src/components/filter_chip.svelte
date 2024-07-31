<script lang="ts">
  import IconClose from "./icon_close.svelte";

  interface Props {
    open: Boolean
    onClick: () => void
    onRemoveClick: () => void
  }

  let {
    open,
    onClick,
    onRemoveClick
  }: Props = $props()
</script>

<div class="filter" class:open={open}>
  <button class="open-button" onmousedown={() => onClick()}><slot /></button>
  <button class="delete-button" onclick={() => onRemoveClick()}><IconClose /></button>
</div>

<style>
  button {
    border-radius: 0;
    background: transparent;
    padding: 0;
    margin: 0;
    width: auto;
    height: 100%;
  }

  button:active, button:focus {
    background: transparent;

  }

  .filter {
    border-radius: 4px;
    background: var(--framer-color-bg);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: flex;
    height: 23px;
    flex-shrink: 0;
    align-content: center;
    width: auto;
    overflow: hidden;
  }

  .filter.open {
    background: var(--framer-color-tint-dimmed);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--framer-color-tint);
  }

  :global([data-framer-theme="dark"]) .filter {
    background: rgba(255, 255, 255, 0.2);
  }

  :global([data-framer-theme="dark"]) .filter.open {
    background: rgba(255, 255, 255, 0.1);
  }

  .open-button {
    display: flex;
    align-items: center;
    padding: 0 8px;
    padding-right: 1px;
  }

  .delete-button {
    color: var(--framer-color-text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
  }
</style>
