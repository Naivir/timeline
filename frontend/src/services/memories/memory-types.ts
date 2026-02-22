export type PointAnchor = {
  type: 'point'
  timestamp: string
}

export type RangeAnchor = {
  type: 'range'
  start: string
  end: string
}

export type TemporalAnchor = PointAnchor | RangeAnchor

export type MemoryItem = {
  id: string
  sessionId: string
  anchor: TemporalAnchor
  title: string
  description?: string | null
  tags: string[]
  verticalRatio: number
  createdAt: string
  updatedAt: string
}

export type MemoryListResponse = {
  memories: MemoryItem[]
}

export type MemoryCreateRequest = {
  anchor: TemporalAnchor
  title: string
  description?: string
  tags?: string[]
  verticalRatio?: number
}

export type MemoryUpdateRequest = Partial<MemoryCreateRequest>

export const DEFAULT_SESSION_ID = 'timeline-main'
