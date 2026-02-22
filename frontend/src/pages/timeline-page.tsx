import { useCallback, useEffect, useMemo, useState } from 'react'

import { TimelineBaseline } from '../components/timeline-baseline'
import { TimelineErrorBanner } from '../components/timeline-error-banner'
import { ApiResponseError, fetchTimeline } from '../services/timeline-api'
import { mapTimelineResponseToViewModel, type TimelineViewModel } from '../services/timeline-mapper'
import { isError, isLoading, isReady, type ViewState } from '../services/view-state'

function getReadableError(error: unknown): string {
  if (error instanceof ApiResponseError) {
    if (error.code === 'SERVICE_UNAVAILABLE') {
      return 'Timeline service is temporarily unavailable. Please retry in a moment.'
    }
    return error.message
  }
  return (error as Error).message || 'Unable to load timeline.'
}

export default function TimelinePage() {
  const [state, setState] = useState<ViewState>('loading')
  const [timeline, setTimeline] = useState<TimelineViewModel | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const loadTimeline = useCallback(async (signal?: AbortSignal) => {
    setState('loading')
    setErrorMessage('')

    try {
      const payload = await fetchTimeline(signal)
      setTimeline(mapTimelineResponseToViewModel(payload))
      setState('ready')
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return
      }
      setErrorMessage(getReadableError(error))
      setState('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadTimeline(controller.signal)
    return () => controller.abort()
  }, [loadTimeline])

  const title = useMemo(() => timeline?.title ?? 'Timeline', [timeline])
  const hasMarkers = (timeline?.markers.length ?? 0) > 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <header>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">A baseline timeline that is ready to be extended.</p>
        </header>

        {isLoading(state) && <p className="text-sm">Loading timeline...</p>}
        {isError(state) && <TimelineErrorBanner message={errorMessage} onRetry={() => void loadTimeline()} />}

        {isReady(state) && timeline && (
          <>
            <TimelineBaseline timeline={timeline} />
            {!hasMarkers && (
              <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                No memory markers yet. The base timeline is ready for future events.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  )
}
