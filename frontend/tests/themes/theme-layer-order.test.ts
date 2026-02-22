import { describe, expect, it } from 'vitest'

import { pickTopmostTheme, sortThemesForRender } from '../../src/services/themes/theme-layer-order'
import type { ThemeItem } from '../../src/services/themes/theme-types'

const theme = (id: string, priority: number, createdAt: string): ThemeItem => ({
  id,
  sessionId: 'timeline-main',
  startTime: '2026-01-01T00:00:00Z',
  endTime: '2026-01-08T00:00:00Z',
  title: id,
  description: null,
  tags: [],
  color: '#3b82f6',
  opacity: 0.3,
  priority,
  heightPx: 90,
  createdAt,
  updatedAt: createdAt,
})

describe('theme layer ordering', () => {
  it('sorts by priority then creation time', () => {
    const sorted = sortThemesForRender([
      theme('new-low', 10, '2026-01-02T00:00:00Z'),
      theme('high', 900, '2026-01-01T00:00:00Z'),
      theme('old-low', 10, '2026-01-01T00:00:00Z'),
    ])
    expect(sorted.map((item) => item.id)).toEqual(['old-low', 'new-low', 'high'])
  })

  it('picks topmost as last rendered element', () => {
    const top = pickTopmostTheme([
      theme('a', 100, '2026-01-01T00:00:00Z'),
      theme('b', 100, '2026-01-02T00:00:00Z'),
    ])
    expect(top?.id).toBe('b')
  })
})
