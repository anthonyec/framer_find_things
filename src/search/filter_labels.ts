import type { CategoryFilter, SizeFilter } from "./filters"

import { comparatorNames } from "./filters";

import * as text from "../utils/text"

export function getCategoryFilterLabel(filter: CategoryFilter): string {
  return `${text.capitalize(filter.category)}`
}

export function getSizeFilterLabel(filter: SizeFilter): string {
  const name = comparatorNames[filter.comparator]
  return `${name} ${filter.width}x${filter.height}`
}
