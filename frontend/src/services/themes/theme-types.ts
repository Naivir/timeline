export type ThemeItem = {
  id: string
  sessionId: string
  startTime: string
  endTime: string
  title: string
  abbreviatedTitle?: string | null
  description?: string | null
  tags: string[]
  color: string
  opacity: number
  priority: number
  topPx?: number
  bottomPx?: number
  heightPx?: number
  createdAt: string
  updatedAt: string
}

export type ThemeListResponse = {
  sessionId: string
  themes: ThemeItem[]
}

export type ThemeCreateRequest = {
  startTime: string
  endTime: string
  title: string
  abbreviatedTitle?: string
  description?: string
  tags?: string[]
  color: string
  opacity: number
  priority: number
  topPx?: number
  bottomPx?: number
  heightPx?: number
}

export type ThemeUpdateRequest = Partial<ThemeCreateRequest>
