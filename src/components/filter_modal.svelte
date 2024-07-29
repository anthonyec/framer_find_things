<script lang="ts">
</script>

<modal class="filter-modal" open>
  <slot />
</modal>

<style>
  .filter-modal {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 1;
  }
</style>
