<script lang="ts">
  import { getContext } from "svelte";

  const { target } : {
    target: HTMLElement | undefined
   } = getContext("popup");

  // TODO(anthony): Funny how this can't be exported here.
  interface Props {
    title?: string;
    onDismiss?: () => void
  }

  let {
    title,
    onDismiss
  }: Props = $props()

  let position = $derived.by(() => {
    if (!target) return { x: 0, y: 0 };

    const { x, y } = target.getBoundingClientRect();

    return {
      x,
      y,
    }
  });
</script>

<modal class="popup" open style:left="{position.x}px" style:top="{position.y}px">
  <!-- {#if title}
    <h2>{title}</h2>
  {/if} -->
  <slot />
</modal>

<style>
  .popup {
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    background: var(--framer-color-bg);
    border-radius: 8px;
    position: absolute;
    z-index: 1;
  }

  h2 {
    font-size: 12px;
    padding: 4px;
  }
</style>
