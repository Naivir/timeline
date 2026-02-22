const MIN_THEME_DURATION_MS = 30 * 60 * 1000

export function clampThemeHeight(heightPx: number): number {
  return Math.max(24, Math.min(600, heightPx))
}

export function clampThemeOpacity(opacity: number): number {
  return Math.max(0.05, Math.min(1, opacity))
}

export function normalizeThemeRange(startMs: number, endMs: number): { startMs: number; endMs: number } {
  let s = Math.min(startMs, endMs)
  let e = Math.max(startMs, endMs)
  if (e - s < MIN_THEME_DURATION_MS) {
    const center = (s + e) / 2
    s = center - MIN_THEME_DURATION_MS / 2
    e = center + MIN_THEME_DURATION_MS / 2
  }
  return { startMs: s, endMs: e }
}

