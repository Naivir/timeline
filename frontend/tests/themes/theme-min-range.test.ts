import { describe, expect, it } from 'vitest'

import { normalizeThemeRange } from '../../src/services/themes/theme-geometry'

describe('theme minimum range normalization', () => {
  it('auto-expands very small drag selections', () => {
    const center = new Date('2026-01-10T00:00:00Z').getTime()
    const next = normalizeThemeRange(center, center + 60_000)
    expect(next.endMs - next.startMs).toBeGreaterThanOrEqual(30 * 60 * 1000)
  })
})
