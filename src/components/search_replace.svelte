<script lang="ts">
</script>

<style>
  .search-replace {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    position: relative;
  }

  input {
    width: 100%
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 8px;
  }
</style>

<div class="search-replace">
  <div class="row">
    <input type="text">
    <div class="actions">
      <button>Aa</button>
      <button>.*</button>
    </div>
  </div>
  <div class="row">
    <input type="text">
    <div class="actions">
      <button>AB</button>
    </div>
  </div>
</div>
