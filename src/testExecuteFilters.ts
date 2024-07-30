import type { Filter } from "./search/filters";

async function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  })
}

export async function executeFilters(filters: Filter[], index: string[]) {
  const result = []

  for (const entry of index) {
    let include = true;

    for (const filter of filters) {
      if (filter.id === "text-search" && !entry.includes(filter.query)) {
        include = false
        break
      }

      if (filter.id === "category" && filter.id === "category" && !entry.includes("foo")) {
        include = false
        break
      }
    }

    if (include) {
      result.push(entry)
    }
  }

  await sleep(500);

  return result;
}
