import { useEffect, useMemo, useRef, useState } from 'react'

import { MemoryLayer } from '../../components/memories/memory-layer'
import type { MemoryItem, MemoryUpdateRequest } from '../../services/memories/memory-types'
import { generateLabelTicks } from '../../services/timeline/label-ticks'
import {
  createInitialTimelineState,
  isZoomBlockedAtBounds,
  panTimeline,
  zoomTimeline,
  type TimelineState
} from '../../services/timeline/timeline-state'
import {
  createVerticalWheelZoomState,
  shouldApplyVerticalWheelZoom,
} from '../../services/timeline/wheel-zoom'

type TimelineSurfaceProps = {
  memories?: MemoryItem[]
  selectedMemoryId?: string | null
  onSelectMemory?: (memoryId: string | null) => void
  onPlaceMemoryAt?: (timeMs: number, verticalRatio: number) => void
  onUpdateMemory?: (memoryId: string, payload: MemoryUpdateRequest) => void
  isPlacementArmed?: boolean
}

export function TimelineSurface({
  memories = [],
  selectedMemoryId = null,
  onSelectMemory,
  onPlaceMemoryAt,
  onUpdateMemory,
  isPlacementArmed = false,
}: TimelineSurfaceProps) {
  const [timelineState, setTimelineState] = useState<TimelineState>(() => createInitialTimelineState())
  const [isDragging, setIsDragging] = useState(false)
  const [lastX, setLastX] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  const verticalWheelStateRef = useRef(createVerticalWheelZoomState())

  const ticks = useMemo(
    () =>
      generateLabelTicks(
        timelineState.startMs,
        timelineState.endMs,
        timelineState.widthPx,
        timelineState.activeResolution
      ),
    [timelineState]
  )

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const syncWidth = () => {
      const width = Math.max(1, Math.round(node.clientWidth))
      setTimelineState((state) => (state.widthPx === width ? state : { ...state, widthPx: width }))
    }

    syncWidth()
    const observer = new ResizeObserver(syncWidth)
    observer.observe(node)
    window.addEventListener('resize', syncWidth)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncWidth)
    }
  }, [])

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.button !== 0) return
    if (isPlacementArmed) return
    setIsDragging(true)
    setLastX(event.clientX)
    if ('setPointerCapture' in event.currentTarget) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (isPlacementArmed) return
    if (!isDragging || lastX == null) return
    const delta = event.clientX - lastX
    setLastX(event.clientX)
    setTimelineState((state) => panTimeline(state, delta))
  }

  const stopDragging: React.PointerEventHandler<HTMLDivElement> = (event) => {
    setIsDragging(false)
    setLastX(null)
    if ('releasePointerCapture' in event.currentTarget) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    // Keep zoom behavior owned by the timeline so the page never scrolls/zooms.
    event.preventDefault()
    const rect = ref.current?.getBoundingClientRect()
    const anchorX = rect ? event.clientX - rect.left : timelineState.widthPx / 2
    const absX = Math.abs(event.deltaX)
    const absY = Math.abs(event.deltaY)
    const isHorizontalZoom = absX > absY
    const zoomDelta = isHorizontalZoom ? event.deltaX : event.deltaY

    if (!Number.isFinite(zoomDelta) || zoomDelta === 0) return

    if (!isHorizontalZoom) {
      const { apply, nextState } = shouldApplyVerticalWheelZoom(
        verticalWheelStateRef.current,
        zoomDelta,
        performance.now()
      )
      verticalWheelStateRef.current = nextState
      if (!apply) return
    }

    setTimelineState((state) => {
      if (isZoomBlockedAtBounds(state, zoomDelta)) {
        return state
      }
      return zoomTimeline(state, zoomDelta, anchorX)
    })
  }

  return (
    <section className="timeline-shell" aria-label="Timeline interaction surface">
      <div
        ref={ref}
        className={`timeline-surface ${isPlacementArmed ? 'timeline-surface-placement' : ''}`}
        data-testid="timeline-surface"
        data-start-ms={timelineState.startMs}
        data-end-ms={timelineState.endMs}
        data-resolution={timelineState.activeResolution}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onWheel={onWheel}
      >
        <div className="timeline-fade-left" />
        <div className="timeline-fade-right" />

        <div className="timeline-line" aria-label="Timeline axis" />

        <MemoryLayer
          memories={memories}
          selectedId={selectedMemoryId}
          startMs={timelineState.startMs}
          endMs={timelineState.endMs}
          widthPx={timelineState.widthPx}
          isPlacementArmed={isPlacementArmed}
          onSelect={(id) => onSelectMemory?.(id)}
          onCreateAt={(timeMs, verticalRatio) => onPlaceMemoryAt?.(timeMs, verticalRatio)}
          onUpdateMemory={(memoryId, payload) => onUpdateMemory?.(memoryId, payload)}
        />

        {ticks
          .filter((tick) => tick.visible)
          .map((tick) => (
            <div
              key={`guide-${tick.timestamp}`}
              className="timeline-guide"
              data-testid="timeline-guide"
              style={{ left: `${tick.x}px`, opacity: tick.edgeOpacity * 0.55 }}
            />
          ))}

        {ticks
          .filter((tick) => tick.visible)
          .map((tick) => (
            <div
              key={tick.timestamp}
              className="timeline-label"
              data-testid="timeline-label"
              style={{ left: `${tick.x}px`, opacity: tick.edgeOpacity }}
            >
              {tick.text}
            </div>
          ))}
      </div>
    </section>
  )
}
