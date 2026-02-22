import { describe, expect, it } from 'vitest'

import { generateLabelTicks } from '../../src/services/timeline/label-ticks'

describe('generateLabelTicks', () => {
  it('filters overly dense labels', () => {
    const start = Date.UTC(2026, 0, 1)
    const end = start + 2 * 24 * 60 * 60 * 1000

    const ticks = generateLabelTicks(start, end, 120, 'hour')
    const visible = ticks.filter((t) => t.visible)

    expect(visible.length).toBeLessThan(ticks.length)
    expect(ticks.some((tick) => tick.x < 0 || tick.x > 120)).toBe(true)
    expect(visible.every((tick) => tick.edgeOpacity >= 0 && tick.edgeOpacity <= 1)).toBe(true)
    for (let i = 1; i < visible.length; i += 1) {
      expect(visible[i].x - visible[i - 1].x).toBeGreaterThanOrEqual(80)
    }
  })
})
