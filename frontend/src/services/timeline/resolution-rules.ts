export type ResolutionLevel = 'year' | 'month' | 'day' | 'hour'

export const RESOLUTION_ORDER: ResolutionLevel[] = ['year', 'month', 'day', 'hour']

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const MONTH_MS = 30 * DAY_MS
const YEAR_MS = 365 * DAY_MS

export function resolutionFromDuration(durationMs: number): ResolutionLevel {
  if (durationMs <= 3 * DAY_MS) return 'hour'
  if (durationMs <= 120 * DAY_MS) return 'day'
  if (durationMs <= 6 * YEAR_MS) return 'month'
  return 'year'
}

export function formatByResolution(date: Date, resolution: ResolutionLevel): string {
  if (resolution === 'year') return String(date.getUTCFullYear())
  if (resolution === 'month') return date.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  if (resolution === 'day') return date.toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false, timeZone: 'UTC' })
}

export function stepMsForResolution(resolution: ResolutionLevel): number {
  if (resolution === 'year') return YEAR_MS
  if (resolution === 'month') return MONTH_MS
  if (resolution === 'day') return DAY_MS
  return HOUR_MS
}
