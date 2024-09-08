<script lang="ts">
  import type { IndexEntry, Result } from "./search/types"
  import type { CategoryFilter, Filter, TextFilter } from "./search/filters";

  import HighlightRange from './components/highlight_range.svelte';
	import SearchReplace from './components/search_replace.svelte';
  import { executeFilters } from './search/execute_filters';
  import { replaceAll } from "./search/replace_all"
  import { framer } from "framer-plugin"
  import ResultRow from "./components/result_row.svelte";
  import { pluralize } from "./utils/text";
  import { clamp } from "./utils/math";
  import { Indexer } from "./search/indexer";
  import Spinner from "./components/spinner.svelte";
  import PlaceholderResultRow from "./components/placeholder_result_row.svelte";
  import starsImage from "./assets/stars.png"

  let indexing: boolean = $state(false)
  let selectedIndex: number = $state(-1)
  let canvasSelection: string[] = $state([])

  let index: Record<string, IndexEntry> = $state({})

  let textSearchFilter: TextFilter = $state({
    id: "text-search",
    type: "text",
    query: "",
    caseSensitive: false,
    regex: false,
  })
  let categoryFilter: CategoryFilter = $state({ id: "category", type: "category", category: "all" })

  let filters: Filter[] = $state([textSearchFilter, categoryFilter])
  let entries: IndexEntry[] = $derived(Object.values(index))
  let results: Result[] = $derived(executeFilters(filters, entries))

	let replacement: string = $state("");
	let searchProject: boolean = $state(false);

	const performReplaceAll = () => {
    if (!replacement) return

    replaceAll(results, replacement, false)
	};

  const navigateResults = (direction: number) => {
    selectedIndex = clamp(selectedIndex + direction, 0, results.length - 1)
  }

  const focusResult = async (result: Result) => {
    await framer.setSelection(result.id)
    await framer.zoomIntoView(result.id)
  }

  $effect(() => {
    return framer.subscribeToSelection((selection) => {
      canvasSelection = selection.map((node) => node.id)
    })
  })

  $effect(() => {
    index = {}

    const indexer = new Indexer({
      scope: searchProject ? "project" : "page",
      includedNodeTypes: ["FrameNode", "SVGNode", "ComponentInstanceNode"],
      includedAttributes: [],

      onStarted: () => {
        indexing = true
      },

      onUpsert: (entry) => {
        index[entry.id] = entry
      },

      onCompleted: () => {
        indexing = false
      }
    })

    indexer.start()

    return framer.subscribeToCanvasRoot(async () => {
      // indexer.start()
    })
  })
</script>

<div class="app">
  <div class="splash">
    <img src={starsImage} alt="Stars">
  </div>

  <SearchReplace
    bind:query={textSearchFilter.query}
    bind:replacement={replacement}
    onRenameClick={performReplaceAll}
  />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: absolute;
    gap: 10px
  }

  .splash {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .splash img {
    width: 159px;
  }
</style>
