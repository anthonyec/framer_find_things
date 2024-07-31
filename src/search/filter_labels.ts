import type { CategoryFilter, LayerFilter, SizeFilter } from "./filters"

import { comparatorNames } from "./filters";

import * as text from "../utils/text"

export function getCategoryFilterLabel(filter: CategoryFilter): string {
  return `${text.capitalize(filter.category)}`
}

export function getSizeFilterLabel(filter: SizeFilter): string {
  const name = comparatorNames[filter.comparator]

  if (!filter.width || !filter.height) {
    if (!filter.height) {
      return `Width ${name} ${filter.width}`
    }

    if (!filter.width) {
      return `Height ${name} ${filter.height}`
    }
  }

  return `${text.capitalize(name)} ${filter.width}x${filter.height}`
}

export function getLayerFilterLabel(filter: LayerFilter): string {
  if (filter.locked) {
    return "Locked"
  }

  return "Unlocked"
}
