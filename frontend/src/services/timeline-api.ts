export type TimelineResponse = {
  timeline: {
    id: string
    title: string
    startLabel: string
    endLabel: string
    createdAt: string
    updatedAt: string
  }
  baseline: {
    orientation: 'horizontal'
    positionPercent: number
    thicknessPx: number
    lengthPercent: number
  }
  eventPlaceholders: Array<{
    id: string
    timeLabel: string
    positionPercent: number
    status: 'empty' | 'reserved'
    metadata?: Record<string, unknown>
  }>
  meta: {
    requestId: string
  }
}

export type ApiError = {
  code: string
  message: string
}

export class ApiResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message)
    this.name = 'ApiResponseError'
  }
}

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function fetchTimeline(signal?: AbortSignal): Promise<TimelineResponse> {
  const response = await fetch(`${apiBase}/api/v1/timeline`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  })

  if (!response.ok) {
    let apiError: ApiError = {
      code: response.status === 503 ? 'SERVICE_UNAVAILABLE' : 'TIMELINE_FETCH_FAILED',
      message: 'Timeline data is unavailable right now.'
    }

    try {
      const payload = (await response.json()) as Partial<ApiError>
      apiError = {
        code: payload.code ?? apiError.code,
        message: payload.message ?? apiError.message
      }
    } catch {
      // keep fallback error payload
    }

    throw new ApiResponseError(apiError.message, response.status, apiError.code)
  }

  return (await response.json()) as TimelineResponse
}

export async function fetchHealth(signal?: AbortSignal): Promise<{ status: string; message: string }> {
  const response = await fetch(`${apiBase}/api/v1/health`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  })

  if (!response.ok) {
    throw new ApiResponseError('Health check failed', response.status, 'HEALTH_CHECK_FAILED')
  }

  return (await response.json()) as { status: string; message: string }
}
