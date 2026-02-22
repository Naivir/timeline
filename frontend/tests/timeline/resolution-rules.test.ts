import { describe, expect, it } from 'vitest'

import { resolutionFromDuration } from '../../src/services/timeline/resolution-rules'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

describe('resolutionFromDuration', () => {
  it('maps fine durations to hour/day', () => {
    expect(resolutionFromDuration(2 * DAY)).toBe('hour')
    expect(resolutionFromDuration(30 * DAY)).toBe('day')
  })

  it('maps broader durations to month/year', () => {
    expect(resolutionFromDuration(365 * DAY)).toBe('month')
    expect(resolutionFromDuration(15 * 365 * DAY)).toBe('year')
  })
})
