import { describe, expect, it } from 'vitest'

import {
  MAX_DURATION_MS,
  MIN_DURATION_MS,
  createInitialTimelineState,
  isZoomBlockedAtBounds,
  zoomTimeline
} from '../../src/services/timeline/timeline-state'

describe('zoom bounds', () => {
  it('blocks zoom-in at minimum duration and keeps range unchanged', () => {
    const state = createInitialTimelineState(Date.UTC(2026, 0, 1), 1000)
    const atMin = { ...state, endMs: state.startMs + MIN_DURATION_MS }

    expect(isZoomBlockedAtBounds(atMin, -120)).toBe(true)
    const next = zoomTimeline(atMin, -120, 500)
    expect(next.startMs).toBe(atMin.startMs)
    expect(next.endMs).toBe(atMin.endMs)
  })

  it('blocks zoom-out at maximum duration and keeps range unchanged', () => {
    const state = createInitialTimelineState(Date.UTC(2026, 0, 1), 1000)
    const atMax = { ...state, endMs: state.startMs + MAX_DURATION_MS }

    expect(isZoomBlockedAtBounds(atMax, 120)).toBe(true)
    const next = zoomTimeline(atMax, 120, 500)
    expect(next.startMs).toBe(atMax.startMs)
    expect(next.endMs).toBe(atMax.endMs)
  })
})
