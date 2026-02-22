import type { TimelineResponse } from './timeline-api'

export type TimelineMarkerViewModel = {
  id: string
  label: string
  positionPercent: number
}

export type TimelineViewModel = {
  id: string
  title: string
  startLabel: string
  endLabel: string
  lineLengthPercent: number
  requestId: string
  markers: TimelineMarkerViewModel[]
}

export function mapTimelineResponseToViewModel(payload: TimelineResponse): TimelineViewModel {
  return {
    id: payload.timeline.id,
    title: payload.timeline.title,
    startLabel: payload.timeline.startLabel,
    endLabel: payload.timeline.endLabel,
    lineLengthPercent: payload.baseline.lengthPercent,
    requestId: payload.meta.requestId,
    markers: payload.eventPlaceholders.map((item) => ({
      id: item.id,
      label: item.timeLabel,
      positionPercent: item.positionPercent
    }))
  }
}
