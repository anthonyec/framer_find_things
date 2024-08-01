<script lang="ts">
  let {
    title,
    target,
  }: { title?: string, target?: HTMLElement | undefined } = $props()

  let position: { x: number, y: number } = $state({ x: 50, y: 50 })

  $effect(() => {
    if (!target) return

    console.log(target)

    const { x, y } = target.getBoundingClientRect()
    position = { x, y }
  })
</script>

<modal class="popup" open style:left={position.x} style:top={position.y}>
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
