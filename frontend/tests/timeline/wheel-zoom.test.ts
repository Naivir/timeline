import { describe, expect, it } from 'vitest'

import { createVerticalWheelZoomState, shouldApplyVerticalWheelZoom } from '../../src/services/timeline/wheel-zoom'

describe('vertical wheel zoom filtering', () => {
  it('suppresses inertial tail after a strong vertical zoom burst', () => {
    let state = createVerticalWheelZoomState()

    const first = shouldApplyVerticalWheelZoom(state, -120, 0)
    expect(first.apply).toBe(true)
    state = first.nextState

    const tail1 = shouldApplyVerticalWheelZoom(state, -8, 10)
    expect(tail1.apply).toBe(false)
    state = tail1.nextState

    const tail2 = shouldApplyVerticalWheelZoom(state, -4, 20)
    expect(tail2.apply).toBe(false)
  })

  it('starts a fresh burst after pause and applies zoom again', () => {
    let state = createVerticalWheelZoomState()

    const first = shouldApplyVerticalWheelZoom(state, -90, 0)
    state = first.nextState
    const tail = shouldApplyVerticalWheelZoom(state, -6, 20)
    state = tail.nextState
    expect(tail.apply).toBe(false)

    const nextBurst = shouldApplyVerticalWheelZoom(state, -6, 220)
    expect(nextBurst.apply).toBe(true)
  })
})
