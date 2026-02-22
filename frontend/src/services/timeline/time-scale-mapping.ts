export function timeToX(timeMs: number, startMs: number, endMs: number, widthPx: number): number {
  if (endMs <= startMs) return 0
  const ratio = (timeMs - startMs) / (endMs - startMs)
  return ratio * widthPx
}

export function xToTime(x: number, startMs: number, endMs: number, widthPx: number): number {
  if (widthPx <= 0) return startMs
  const ratio = x / widthPx
  return startMs + ratio * (endMs - startMs)
}
