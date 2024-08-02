<script lang="ts">
  import type { SizeFilter } from "../search/filters";

  import * as text from "../utils/text"
  import { comparatorNames, comparators } from "../search/filters";
  import Popup from "./popup.svelte";
  import type { MouseEventHandler } from "svelte/elements";
  import { Vector2 } from "../utils/vector2";

  let {
    filter = $bindable(),
  }: { filter: SizeFilter } = $props()

  let width = $derived(filter.width ?? 1)
  let height = $derived(filter.height ?? 1)
  let aspectRatio = $derived(width / height)
</script>

<Popup title="Size">
  <div class="form">
    <div class="group">
      <select bind:value={filter.comparator}>
        {#each comparators as comparator}
          <option value={comparator}>{text.capitalize(comparatorNames[comparator])}</option>
        {/each}
      </select>

      <div class="size-inputs">
        <input type="number" placeholder="Width" bind:value={filter.width} />
        <input type="number" placeholder="Height" bind:value={filter.height} />
      </div>
    </div>

    <div class="preview">
      <div
        class="preview-frame" style:aspect-ratio={aspectRatio}
        style:width={width >= height ? "60%" : "auto"}
        style:height={width <= height ? "60%" : "auto"}
        role="button"
        tabindex="-1"
      >
      </div>
    </div>
  </div>
</Popup>

<style>
  select {
    border-radius: 4px;
    width: 100%;
  }

  input {
    border-radius: 4px;
    width: 80px;
  }

  .form {
    padding: 8px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .preview {
    background: var(--framer-color-bg-tertiary);
    border-radius: 8px;
    aspect-ratio: 1/1;
    position: relative;
  }

  .preview-frame {
    background: var(--framer-color-bg);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .1), 0px 1px 0px 0px rgba(0, 0, 0, .05);
    border-radius: 4px;
    aspect-ratio: 1/1;
    position: absolute;
    min-width: 5px;
    min-height: 5px;
    max-width: 60%;
    max-height: 60%;
    top: 50%;
    left: 50%;
    transition: all ease 150ms;
    transform: translate(-50%, -50%);
  }

  .size-inputs {
    display: flex;
    gap: 8px;
  }
</style>
