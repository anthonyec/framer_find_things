<script lang="ts">
</script>

<modal class="filter-modal" open>
  <slot />
</modal>

<style>
  .filter-modal {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    background: white;
    border-radius: 14px;
    position: absolute;
    min-width: 150px;
    z-index: 1;
    padding: 6px;
  }
</style>
