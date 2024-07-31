<script lang="ts">
  let {
    title
  }: { title?: string } = $props()
</script>

<modal class="popup" open>
  <!-- {#if title}
    <h2>{title}</h2>
  {/if} -->

  <slot />
</modal>

<style>
  .popup {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
