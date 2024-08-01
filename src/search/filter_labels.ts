import type { CategoryFilter, ColorFilter, LayerFilter, SizeFilter } from "./filters"

import { comparatorNames } from "./filters";

import * as text from "../utils/text"
import * as color from "../utils/color";

export function getCategoryFilterLabel(filter: CategoryFilter): string {
  return `${text.capitalize(filter.category).replaceAll("-", " ")}`
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

export function getColorFilterLabel(filter: ColorFilter): string {
  return color.serializeColorRGBA(filter.color)
}
