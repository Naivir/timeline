import { describe, expect, it } from 'vitest'

import { applyThemeTranslation, normalizeThemeVerticalBounds, snapTo4Px } from '../../src/services/themes/theme-geometry'
import { getThemeInlineTitle } from '../../src/components/themes/theme-block'

describe('theme geometry consistency', () => {
  it('create/resize use the same 4px snap contract', () => {
    const created = normalizeThemeVerticalBounds(101, 177, 320)
    expect(created.topPx % 4).toBe(0)
    expect(created.bottomPx % 4).toBe(0)

    const resizedTop = snapTo4Px(created.topPx + 9)
    const resizedBottom = snapTo4Px(created.bottomPx + 7)
    expect(resizedTop % 4).toBe(0)
    expect(resizedBottom % 4).toBe(0)
  })

  it('resize-mode vertical translation preserves duration and height', () => {
    const moved = applyThemeTranslation({
      initialStartMs: 2_000_000,
      initialEndMs: 5_600_000,
      initialTopPx: 104,
      initialBottomPx: 184,
      deltaMs: 900,
      deltaYPx: 21,
      axisY: 220,
    })
    expect(moved.endMs - moved.startMs).toBe(3_600_000)
    expect(moved.startMs).toBe(2_000_900)
    expect(moved.endMs).toBe(5_600_900)
    expect(moved.bottomPx - moved.topPx).toBe(80)
    expect(moved.bottomPx).toBeLessThanOrEqual(220)
    expect(moved.topPx % 4).toBe(0)
    expect(moved.bottomPx % 4).toBe(0)
  })

  it('chooses full title then abbreviated title then no inline title by horizontal fit', () => {
    const full = getThemeInlineTitle({
      title: 'Learning the Language of Light',
      abbreviatedTitle: 'Light',
      widthPx: 260,
      heightPx: 20,
    })
    expect(full).toBe('Learning the Language of Light')

    const abbreviated = getThemeInlineTitle({
      title: 'Learning the Language of Light',
      abbreviatedTitle: 'Light',
      widthPx: 70,
      heightPx: 20,
    })
    expect(abbreviated).toBe('Light')

    const none = getThemeInlineTitle({
      title: 'Learning the Language of Light',
      abbreviatedTitle: undefined,
      widthPx: 70,
      heightPx: 20,
    })
    expect(none).toBeNull()
  })
})
