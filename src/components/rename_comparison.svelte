<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    before: string;
    after: string;
    children: Snippet;
  }

  let { before, after, children }: Props = $props();
</script>

<div class="replace-comparison">
  <div class="before">
    <div class="icon">
      {@render children()}
    </div>

    <div class="label">
      {before}
    </div>
  </div>

  {#if after}
    <div class="chevron">
      <svg width="5px" height="8px" viewBox="0 0 5 8">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
            <g transform="translate(1, 1)" fill-rule="nonzero" stroke="#999999" stroke-width="1.5">
                <polyline id="Path" points="0 6 3 3 0 0"></polyline>
            </g>
        </g>
    </svg>
    </div>

    <div class="after">
      <div class="icon">
        {@render children()}
      </div>

      <div class="label">
        {after}
      </div>
    </div>
  {/if}
</div>

<style>
  .replace-comparison {
    color: #666666;
    display: grid;
    grid-template-columns: 1fr 55px 1fr;
    align-items: center;
    height: 30px;
    gap: 10px;
    width: 100%;
  }

  .chevron {
    color: var(--framer-color-text-tertiary);
    place-self: center;
  }

  .before,
  .after {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  }

  .label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }

  .icon {
    flex-shrink: 0;
  }

  .before .icon {
    color: var(--framer-color-text-tertiary);
  }

  .after .icon {
    color: var(--framer-color-tint);
  }
</style>
