import { describe, expect, it } from 'vitest'

import { generateLabelTicks } from '../../src/services/timeline/label-ticks'

describe('label continuity', () => {
  it('keeps visible tick cadence stable across small pan deltas', () => {
    const start = Date.UTC(2026, 0, 1)
    const end = start + 10 * 24 * 60 * 60 * 1000
    const width = 1200

    const before = generateLabelTicks(start, end, width, 'hour')
      .filter((tick) => tick.visible)
      .map((tick) => tick.timestamp)

    const deltaMs = 30 * 60 * 1000
    const after = generateLabelTicks(start + deltaMs, end + deltaMs, width, 'hour')
      .filter((tick) => tick.visible)
      .map((tick) => tick.timestamp)

    const beforeSet = new Set(before)
    const overlap = after.filter((timestamp) => beforeSet.has(timestamp)).length

    expect(overlap).toBeGreaterThanOrEqual(Math.floor(after.length * 0.8))
  })
})
