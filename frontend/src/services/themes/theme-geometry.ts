const MIN_THEME_DURATION_MS = 30 * 60 * 1000
export const THEME_VERTICAL_SNAP_PX = 4
export const MIN_THEME_HEIGHT_PX = 24
export const MAX_THEME_HEIGHT_PX = 600

export function snapTo4Px(value: number): number {
  return Math.round(value / THEME_VERTICAL_SNAP_PX) * THEME_VERTICAL_SNAP_PX
}

export function clampThemeHeight(heightPx: number): number {
  return Math.max(MIN_THEME_HEIGHT_PX, Math.min(MAX_THEME_HEIGHT_PX, heightPx))
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

export function normalizeThemeVerticalBounds(
  startY: number,
  currentY: number,
  axisY: number,
): { topPx: number; bottomPx: number } {
  const draggingDown = currentY >= startY
  const clampedStart = Math.max(0, Math.min(axisY, startY))
  const clampedCurrent = Math.max(0, Math.min(axisY, currentY))

  if (draggingDown) {
    const snappedTop = snapTo4Px(Math.min(clampedStart, axisY - MIN_THEME_HEIGHT_PX))
    const minBottom = snappedTop + MIN_THEME_HEIGHT_PX
    const snappedBottom = Math.max(minBottom, snapTo4Px(clampedCurrent))
    return { topPx: snappedTop, bottomPx: Math.min(axisY, snappedBottom) }
  }

  const snappedBottom = snapTo4Px(clampedStart)
  const maxTop = snappedBottom - MIN_THEME_HEIGHT_PX
  const snappedTop = Math.min(maxTop, snapTo4Px(clampedCurrent))
  return { topPx: Math.max(0, snappedTop), bottomPx: snappedBottom }
}

type ThemeTranslationInput = {
  initialStartMs: number
  initialEndMs: number
  initialTopPx: number
  initialBottomPx: number
  deltaMs: number
  deltaYPx: number
  axisY: number
}

type ThemeCornerResizeInput = {
  corner: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  initialStartMs: number
  initialEndMs: number
  initialTopPx: number
  initialBottomPx: number
  deltaMs: number
  deltaYPx: number
  axisY: number
}

export function applyThemeTranslation(input: ThemeTranslationInput): {
  startMs: number
  endMs: number
  topPx: number
  bottomPx: number
} {
  const height = Math.max(MIN_THEME_HEIGHT_PX, input.initialBottomPx - input.initialTopPx)
  const maxTop = Math.max(0, input.axisY - height)
  const nextTop = Math.max(0, Math.min(maxTop, snapTo4Px(input.initialTopPx + input.deltaYPx)))
  const nextBottom = nextTop + height
  const normalizedRange = normalizeThemeRange(input.initialStartMs + input.deltaMs, input.initialEndMs + input.deltaMs)
  return {
    startMs: normalizedRange.startMs,
    endMs: normalizedRange.endMs,
    topPx: nextTop,
    bottomPx: nextBottom,
  }
}

export function applyThemeCornerResize(input: ThemeCornerResizeInput): {
  startMs: number
  endMs: number
  topPx: number
  bottomPx: number
} {
  if (input.corner === 'bottom-left' || input.corner === 'bottom-right') {
    const minBottom = input.initialTopPx + MIN_THEME_HEIGHT_PX
    const nextBottom = Math.max(minBottom, Math.min(input.axisY, snapTo4Px(input.initialBottomPx + input.deltaYPx)))
    if (input.corner === 'bottom-left') {
      const normalizedRange = normalizeThemeRange(input.initialStartMs + input.deltaMs, input.initialEndMs)
      return {
        startMs: normalizedRange.startMs,
        endMs: normalizedRange.endMs,
        topPx: input.initialTopPx,
        bottomPx: nextBottom,
      }
    }
    const normalizedRange = normalizeThemeRange(input.initialStartMs, input.initialEndMs + input.deltaMs)
    return {
      startMs: normalizedRange.startMs,
      endMs: normalizedRange.endMs,
      topPx: input.initialTopPx,
      bottomPx: nextBottom,
    }
  }

  const maxTop = input.initialBottomPx - MIN_THEME_HEIGHT_PX
  const nextTop = Math.max(0, Math.min(maxTop, snapTo4Px(input.initialTopPx + input.deltaYPx)))
  if (input.corner === 'top-left') {
    const normalizedRange = normalizeThemeRange(input.initialStartMs + input.deltaMs, input.initialEndMs)
    return {
      startMs: normalizedRange.startMs,
      endMs: normalizedRange.endMs,
      topPx: nextTop,
      bottomPx: input.initialBottomPx,
    }
  }
  const normalizedRange = normalizeThemeRange(input.initialStartMs, input.initialEndMs + input.deltaMs)
  return {
    startMs: normalizedRange.startMs,
    endMs: normalizedRange.endMs,
    topPx: nextTop,
    bottomPx: input.initialBottomPx,
  }
}
