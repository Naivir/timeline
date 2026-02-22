import { describe, expect, it } from 'vitest'

import {
  clampVerticalRatio,
  dragDeltaToTimeMs,
  resizeRangeStart,
  resizeRangeEnd,
} from '../../src/services/memories/memory-drag'

describe('memory drag edit math', () => {
  it('converts x drag delta to time delta', () => {
    // 200px of drag over 1000px viewport across 10_000ms range => 2000ms
    expect(dragDeltaToTimeMs(200, 1000, 0, 10_000)).toBe(2000)
  })

  it('clamps vertical ratio to [0,1]', () => {
    expect(clampVerticalRatio(-1)).toBe(0)
    expect(clampVerticalRatio(0.42)).toBe(0.42)
    expect(clampVerticalRatio(3)).toBe(1)
  })

  it('resizes range start without crossing end', () => {
    const start = Date.parse('2026-03-01T00:00:00Z')
    const end = Date.parse('2026-03-05T00:00:00Z')
    expect(resizeRangeStart(start, end, Date.parse('2026-03-06T00:00:00Z'))).toBe(end)
    expect(resizeRangeStart(start, end, Date.parse('2026-02-28T00:00:00Z'))).toBe(
      Date.parse('2026-02-28T00:00:00Z'),
    )
  })

  it('resizes range end without crossing start', () => {
    const start = Date.parse('2026-03-01T00:00:00Z')
    const end = Date.parse('2026-03-05T00:00:00Z')
    expect(resizeRangeEnd(start, end, Date.parse('2026-02-27T00:00:00Z'))).toBe(start)
    expect(resizeRangeEnd(start, end, Date.parse('2026-03-07T00:00:00Z'))).toBe(
      Date.parse('2026-03-07T00:00:00Z'),
    )
  })
})

