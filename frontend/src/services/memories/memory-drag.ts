export function dragDeltaToTimeMs(
  deltaX: number,
  widthPx: number,
  startMs: number,
  endMs: number,
): number {
  if (widthPx <= 0) return 0
  return (deltaX / widthPx) * (endMs - startMs)
}

export function clampVerticalRatio(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export function resizeRangeStart(startMs: number, endMs: number, proposedStartMs: number): number {
  return Math.min(proposedStartMs, endMs)
}

export function resizeRangeEnd(startMs: number, endMs: number, proposedEndMs: number): number {
  return Math.max(proposedEndMs, startMs)
}

