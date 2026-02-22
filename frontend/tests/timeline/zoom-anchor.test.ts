import { describe, expect, it } from 'vitest'

import { createInitialTimelineState, zoomTimeline } from '../../src/services/timeline/timeline-state'
import { xToTime } from '../../src/services/timeline/time-scale-mapping'

describe('zoomTimeline', () => {
  it('preserves focal anchor around cursor', () => {
    const state = createInitialTimelineState(Date.UTC(2026, 0, 1), 1000)
    const anchorX = 300
    const beforeAnchorTime = xToTime(anchorX, state.startMs, state.endMs, state.widthPx)

    const zoomed = zoomTimeline(state, -120, anchorX)
    const afterAnchorTime = xToTime(anchorX, zoomed.startMs, zoomed.endMs, zoomed.widthPx)

    expect(Math.abs(afterAnchorTime - beforeAnchorTime)).toBeLessThan(1)
  })
})
