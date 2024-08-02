export function normalizeAspectRatio(width: number, height: number): number {
  return Math.max(width, height) / Math.min(width, height)
}
