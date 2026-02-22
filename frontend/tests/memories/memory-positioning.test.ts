import { describe, expect, it } from 'vitest'

import { computeMemoryBranchStyle } from '../../src/components/memories/memory-marker'
import { timeToX } from '../../src/services/timeline/time-scale-mapping'

describe('memory positioning', () => {
  it('maps anchor time deterministically to x position', () => {
    const start = Date.UTC(2026, 0, 1)
    const end = Date.UTC(2026, 0, 11)
    const anchor = Date.UTC(2026, 0, 6)
    const width = 1000

    const x1 = timeToX(anchor, start, end, width)
    const x2 = timeToX(anchor, start, end, width)

    expect(x1).toBe(x2)
    expect(x1).toBeGreaterThan(0)
    expect(x1).toBeLessThan(width)
  })

  it('connects a marker above the axis downward without overshooting', () => {
    const style = computeMemoryBranchStyle(0.3, 260)
    expect(style.top).toBe('100%')
    expect(style.bottom).toBeUndefined()
    expect(style.height).toBe('35px')
  })

  it('connects a marker below the axis upward without overshooting', () => {
    const style = computeMemoryBranchStyle(0.7, 260)
    expect(style.bottom).toBe('100%')
    expect(style.top).toBeUndefined()
    expect(style.height).toBe('35px')
  })
})
