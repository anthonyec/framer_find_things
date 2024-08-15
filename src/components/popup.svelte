<script lang="ts">
  // TODO(anthony): Funny how this can't be exported here.
  interface Props {
    title?: string;
    target?: HTMLElement | undefined;
    onDismiss?: () => void
  }

  let {
    title,
    target,
    onDismiss
  }: Props = $props()

  let modalElement: HTMLElement | undefined = $state()
  let position: { x: number, y: number } = $state({ x: 50, y: 50 })

  const handleWindowClick = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement) || !modalElement) return

    console.log("handleWindowClick", target)

    if (target) {
      console.log("target", target)
    }

    const isClickInside = modalElement.contains(event.target)
    if (isClickInside) return

    onDismiss?.()
  }

  $effect(() => {
    window.addEventListener("click", handleWindowClick)

    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  })

  $effect(() => {
    if (!target) return

    const { x, y } = target.getBoundingClientRect()
    position = { x, y }
  })
</script>

<modal bind:this={modalElement} class="popup" open style:left={position.x} style:top={position.y}>
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
