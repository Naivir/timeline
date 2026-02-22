import { describe, expect, it } from 'vitest'

import { createInitialTimelineState, zoomTimeline } from '../../src/services/timeline/timeline-state'

describe('timeline zoom sensitivity', () => {
  it('applies a responsive zoom step close to 6% per notch', () => {
    const initial = createInitialTimelineState(Date.UTC(2026, 1, 22), 1000)
    const initialDuration = initial.endMs - initial.startMs

    const zoomIn = zoomTimeline(initial, -1, 500)
    const zoomInDuration = zoomIn.endMs - zoomIn.startMs
    expect(zoomInDuration / initialDuration).toBeCloseTo(0.94, 2)

    const zoomOut = zoomTimeline(initial, 1, 500)
    const zoomOutDuration = zoomOut.endMs - zoomOut.startMs
    expect(zoomOutDuration / initialDuration).toBeCloseTo(1.06, 2)
  })
})
