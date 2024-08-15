<script lang="ts">
  import IconCheckmark from "./icon_checkmark.svelte";

  type MenuItem = { id: string, label: string, selected?: boolean, action?: () => void }

  interface Props {
    items: MenuItem[]
  }

  let { items }: Props = $props()

  const showCheckmarks = items.some(item => typeof item.selected === "boolean")

  const handleItemMouseUp = (event: MouseEvent, item: MenuItem) => {
    event.stopPropagation()
    item.action?.()
  }
</script>

<div class="menu-items">
  {#each items as item}
    <button onmouseup={(event) => handleItemMouseUp(event, item)}>
      {#if showCheckmarks}
        <div class="checkmark">
          {#if item.selected}
            <IconCheckmark />
          {/if}
        </div>
      {/if}

      {item.label}
    </button>
  {/each}
</div>

<style>
  .menu-items {
    padding: 5px;
    user-select: none;
  }

  button {
    background: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: none;
    height: 26px;
    gap: 8px;
    padding-right: 16px;
  }

  button:hover {
    background: var(--framer-color-tint);
    color: var(--framer-color-text-reversed)
  }

  .checkmark {
    width: 12px;
    transform: translateY(1px);
  }
</style>
