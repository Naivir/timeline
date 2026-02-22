import { describe, expect, it } from 'vitest'

import { normalizeThemeVerticalBounds, snapTo4Px } from '../../src/services/themes/theme-geometry'

describe('theme placement engine', () => {
  it('snaps values to 4px grid', () => {
    expect(snapTo4Px(101)).toBe(100)
    expect(snapTo4Px(102)).toBe(104)
  })

  it('uses pointer-down as top anchor when dragging downward', () => {
    const bounds = normalizeThemeVerticalBounds(100, 148, 260)
    expect(bounds.topPx).toBe(100)
    expect(bounds.bottomPx).toBe(148)
  })

  it('keeps top anchor stable while dragging downward through min-height region', () => {
    const nearStart = normalizeThemeVerticalBounds(120, 124, 260)
    const farther = normalizeThemeVerticalBounds(120, 164, 260)
    expect(nearStart.topPx).toBe(120)
    expect(farther.topPx).toBe(120)
    expect(farther.bottomPx).toBeGreaterThan(nearStart.bottomPx)
  })

  it('uses pointer-down as bottom anchor when dragging upward', () => {
    const bounds = normalizeThemeVerticalBounds(180, 124, 260)
    expect(bounds.topPx).toBe(124)
    expect(bounds.bottomPx).toBe(180)
  })
})
