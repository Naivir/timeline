import { describe, expect, it } from 'vitest'

import { createInitialTimelineState, panTimeline } from '../../src/services/timeline/timeline-state'

describe('panTimeline', () => {
  it('updates visible range proportionally without changing duration', () => {
    const initial = createInitialTimelineState(Date.UTC(2026, 0, 1), 1000)
    const duration = initial.endMs - initial.startMs

    const moved = panTimeline(initial, 250)

    expect(moved.endMs - moved.startMs).toBe(duration)
    expect(moved.activeResolution).toBe(initial.activeResolution)
    expect(moved.startMs).not.toBe(initial.startMs)
  })

  it('does not snap to fixed boundaries', () => {
    const initial = createInitialTimelineState(Date.UTC(2026, 0, 1), 900)
    const movedA = panTimeline(initial, 73)
    const movedB = panTimeline(initial, 74)

    expect(movedA.startMs).not.toBe(movedB.startMs)
  })
})
