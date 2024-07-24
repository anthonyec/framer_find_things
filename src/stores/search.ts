import type { Filter, TextFilter } from "../search/filters";
import type { Result, SearchIndex } from "../search/types";

import { derived, writable } from "svelte/store";

export const index = writable<SearchIndex>([]);

export const results = writable<Result[]>([]);

export const textSearchFilter = writable<TextFilter>({
  id: "text-search",
  type: "text",
  query: "",
  caseSensitive: false,
  regex: false,
});

export const filters = derived(textSearchFilter, (textSearchFilter) => {
  return [textSearchFilter];
});
