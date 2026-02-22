import { resolutionFromDuration, type ResolutionLevel } from './resolution-rules'
import { xToTime } from './time-scale-mapping'

const DAY_MS = 24 * 60 * 60 * 1000
export const MIN_DURATION_MS = 6 * 60 * 60 * 1000
export const MAX_DURATION_MS = 50 * 365 * DAY_MS

export type TimelineState = {
  startMs: number
  endMs: number
  widthPx: number
  activeResolution: ResolutionLevel
}

export function createInitialTimelineState(now = Date.now(), widthPx = 1000): TimelineState {
  const startMs = now - 365 * DAY_MS
  const endMs = now + 365 * DAY_MS
  return {
    startMs,
    endMs,
    widthPx,
    activeResolution: resolutionFromDuration(endMs - startMs)
  }
}

export function panTimeline(state: TimelineState, deltaPx: number): TimelineState {
  const duration = state.endMs - state.startMs
  const deltaMs = (-deltaPx / Math.max(state.widthPx, 1)) * duration
  const startMs = state.startMs + deltaMs
  const endMs = state.endMs + deltaMs

  return {
    ...state,
    startMs,
    endMs,
    activeResolution: resolutionFromDuration(endMs - startMs)
  }
}

export function zoomTimeline(state: TimelineState, deltaY: number, anchorX: number): TimelineState {
  const duration = state.endMs - state.startMs
  const zoomFactor = deltaY < 0 ? 0.95 : 1.05
  const unclamped = duration * zoomFactor
  const clamped = Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, unclamped))

  const anchorTime = xToTime(anchorX, state.startMs, state.endMs, Math.max(state.widthPx, 1))
  const anchorRatio = anchorX / Math.max(state.widthPx, 1)
  const startMs = anchorTime - anchorRatio * clamped
  const endMs = startMs + clamped

  return {
    ...state,
    startMs,
    endMs,
    activeResolution: resolutionFromDuration(endMs - startMs)
  }
}

export function isZoomBlockedAtBounds(state: TimelineState, deltaY: number): boolean {
  const duration = state.endMs - state.startMs
  if (deltaY < 0) {
    return duration <= MIN_DURATION_MS
  }
  if (deltaY > 0) {
    return duration >= MAX_DURATION_MS
  }
  return true
}

export function deriveVisibleRange(state: TimelineState): { startMs: number; endMs: number } {
  return { startMs: state.startMs, endMs: state.endMs }
}
