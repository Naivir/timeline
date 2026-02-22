export type VerticalWheelZoomState = {
  lastTimestampMs: number
  lastDirection: -1 | 0 | 1
  peakAbsDelta: number
  lastAbsDelta: number
}

const BURST_GAP_MS = 140
const MOMENTUM_SMALL_DELTA = 12
const MOMENTUM_RATIO = 0.35
const MOMENTUM_MIN_PEAK = 24

export function createVerticalWheelZoomState(): VerticalWheelZoomState {
  return {
    lastTimestampMs: -1,
    lastDirection: 0,
    peakAbsDelta: 0,
    lastAbsDelta: 0,
  }
}

export function shouldApplyVerticalWheelZoom(
  state: VerticalWheelZoomState,
  deltaY: number,
  timestampMs: number,
): { apply: boolean; nextState: VerticalWheelZoomState } {
  if (!Number.isFinite(deltaY) || deltaY === 0) {
    return { apply: false, nextState: state }
  }

  const direction = deltaY < 0 ? -1 : 1
  const absDelta = Math.abs(deltaY)
  const isNewBurst =
    state.lastTimestampMs < 0 ||
    timestampMs - state.lastTimestampMs > BURST_GAP_MS ||
    direction !== state.lastDirection

  if (isNewBurst) {
    return {
      apply: true,
      nextState: {
        lastTimestampMs: timestampMs,
        lastDirection: direction,
        peakAbsDelta: absDelta,
        lastAbsDelta: absDelta,
      },
    }
  }

  const isMomentumTail =
    state.peakAbsDelta >= MOMENTUM_MIN_PEAK &&
    absDelta <= MOMENTUM_SMALL_DELTA &&
    absDelta < state.lastAbsDelta &&
    absDelta <= state.peakAbsDelta * MOMENTUM_RATIO
  return {
    apply: !isMomentumTail,
    nextState: {
      lastTimestampMs: timestampMs,
      lastDirection: direction,
      peakAbsDelta: Math.max(state.peakAbsDelta, absDelta),
      lastAbsDelta: absDelta,
    },
  }
}
