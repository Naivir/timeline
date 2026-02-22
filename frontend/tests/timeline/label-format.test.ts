import { describe, expect, it } from 'vitest'

import { formatByResolution } from '../../src/services/timeline/resolution-rules'

describe('formatByResolution', () => {
  const date = new Date(Date.UTC(2026, 5, 15, 13, 30))

  it('formats year labels', () => {
    expect(formatByResolution(date, 'year')).toBe('2026')
  })

  it('formats hour labels with time', () => {
    expect(formatByResolution(date, 'hour')).toMatch(/13:30/)
  })
})
