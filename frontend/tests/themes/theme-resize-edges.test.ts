import { describe, expect, it } from 'vitest'

import { applyThemeCornerResize, normalizeThemeVerticalBounds } from '../../src/services/themes/theme-geometry'
import { getThemeInlineTitle } from '../../src/components/themes/theme-block'

describe('theme resize edge invariants', () => {
  it('never returns inverted vertical bounds', () => {
    const bounds = normalizeThemeVerticalBounds(120, 10, 200)
    expect(bounds.bottomPx).toBeGreaterThan(bounds.topPx)
  })

  it('keeps bounds above axis', () => {
    const bounds = normalizeThemeVerticalBounds(160, 250, 200)
    expect(bounds.bottomPx).toBeLessThanOrEqual(200)
  })

  it('bottom-left corner drag keeps top fixed while changing start and bottom', () => {
    const updated = applyThemeCornerResize({
      corner: 'bottom-left',
      initialStartMs: 1_000_000,
      initialEndMs: 5_000_000,
      initialTopPx: 120,
      initialBottomPx: 220,
      deltaMs: -600,
      deltaYPx: 17,
      axisY: 280,
    })
    expect(updated.topPx).toBe(120)
    expect(updated.bottomPx).toBeGreaterThan(220)
    expect(updated.startMs).toBeLessThan(1_000_000)
    expect(updated.endMs).toBe(5_000_000)
    expect(updated.bottomPx % 4).toBe(0)
  })

  it('bottom-right corner drag keeps top fixed while changing end and bottom', () => {
    const updated = applyThemeCornerResize({
      corner: 'bottom-right',
      initialStartMs: 1_000_000,
      initialEndMs: 5_000_000,
      initialTopPx: 120,
      initialBottomPx: 220,
      deltaMs: 800,
      deltaYPx: -11,
      axisY: 280,
    })
    expect(updated.topPx).toBe(120)
    expect(updated.bottomPx).toBeLessThan(220)
    expect(updated.startMs).toBe(1_000_000)
    expect(updated.endMs).toBeGreaterThan(5_000_000)
    expect(updated.bottomPx % 4).toBe(0)
  })

  it('top-left corner drag keeps bottom fixed while changing start and top', () => {
    const updated = applyThemeCornerResize({
      corner: 'top-left',
      initialStartMs: 1_000_000,
      initialEndMs: 5_000_000,
      initialTopPx: 120,
      initialBottomPx: 220,
      deltaMs: -500,
      deltaYPx: -13,
      axisY: 280,
    })
    expect(updated.bottomPx).toBe(220)
    expect(updated.topPx).toBeLessThan(120)
    expect(updated.startMs).toBeLessThan(1_000_000)
    expect(updated.endMs).toBe(5_000_000)
    expect(updated.topPx % 4).toBe(0)
  })

  it('allows full title at 16px inclusive height', () => {
    const atThreshold = getThemeInlineTitle({
      title: 'Focus Block',
      abbreviatedTitle: 'Focus',
      widthPx: 120,
      heightPx: 16,
    })
    expect(atThreshold).toBe('Focus Block')

    const belowThreshold = getThemeInlineTitle({
      title: 'Focus Block',
      abbreviatedTitle: 'Focus',
      widthPx: 120,
      heightPx: 15,
    })
    expect(belowThreshold).toBe('Focus')
  })
})
