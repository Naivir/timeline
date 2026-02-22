import { formatByResolution, stepMsForResolution, type ResolutionLevel } from './resolution-rules'
import { TIMELINE_CONFIG } from './timeline-config'
import { timeToX } from './time-scale-mapping'

export type LabelTick = {
  timestamp: number
  x: number
  text: string
  visible: boolean
  edgeOpacity: number
}

function edgeOpacityAtX(x: number, widthPx: number): number {
  if (widthPx <= 0) return 0
  const left = Math.min(1, Math.max(0, x / TIMELINE_CONFIG.edgeFadeZonePx))
  const right = Math.min(1, Math.max(0, (widthPx - x) / TIMELINE_CONFIG.edgeFadeZonePx))
  const opacity = Math.min(left, right)
  return Math.max(0, Math.min(1, opacity))
}

export function generateLabelTicks(
  startMs: number,
  endMs: number,
  widthPx: number,
  resolution: ResolutionLevel
): LabelTick[] {
  const step = stepMsForResolution(resolution)
  const first = Math.floor(startMs / step) * step
  const pxPerStep = Math.abs(timeToX(startMs + step, startMs, endMs, widthPx) - timeToX(startMs, startMs, endMs, widthPx))
  const stride = Math.max(1, Math.ceil(TIMELINE_CONFIG.minTickGapPx / Math.max(pxPerStep, 1)))
  const raw: LabelTick[] = []
  const seen = new Set<number>()

  const pushTick = (timestamp: number) => {
    if (seen.has(timestamp)) return
    seen.add(timestamp)
    const x = timeToX(timestamp, startMs, endMs, widthPx)
    const isInRenderableBand =
      x >= -TIMELINE_CONFIG.edgeRenderPaddingPx && x <= widthPx + TIMELINE_CONFIG.edgeRenderPaddingPx
    const absoluteTickIndex = Math.floor(timestamp / step)
    const isStrideAligned = ((absoluteTickIndex % stride) + stride) % stride === 0
    raw.push({
      timestamp,
      x,
      text: formatByResolution(new Date(timestamp), resolution),
      visible: isStrideAligned && isInRenderableBand,
      edgeOpacity: edgeOpacityAtX(Math.max(0, Math.min(widthPx, x)), widthPx)
    })
  }

  for (let t = first - step; t <= endMs + 2 * step; t += step) {
    pushTick(t)
  }

  raw.sort((a, b) => a.timestamp - b.timestamp)

  return raw
}
