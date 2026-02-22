import { useEffect, useMemo, useRef, useState } from 'react'

import { generateLabelTicks } from '../../services/timeline/label-ticks'
import {
  createInitialTimelineState,
  isZoomBlockedAtBounds,
  panTimeline,
  zoomTimeline,
  type TimelineState
} from '../../services/timeline/timeline-state'

export function TimelineSurface() {
  const [timelineState, setTimelineState] = useState<TimelineState>(() => createInitialTimelineState())
  const [isDragging, setIsDragging] = useState(false)
  const [lastX, setLastX] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

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
    setIsDragging(true)
    setLastX(event.clientX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging || lastX == null) return
    const delta = event.clientX - lastX
    setLastX(event.clientX)
    setTimelineState((state) => panTimeline(state, delta))
  }

  const stopDragging: React.PointerEventHandler<HTMLDivElement> = (event) => {
    setIsDragging(false)
    setLastX(null)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    // Wheel and pinch gestures are consumed by timeline zoom behavior.
    event.preventDefault()
    const rect = ref.current?.getBoundingClientRect()
    const anchorX = rect ? event.clientX - rect.left : timelineState.widthPx / 2
    setTimelineState((state) => {
      if (isZoomBlockedAtBounds(state, event.deltaY)) {
        return state
      }
      return zoomTimeline(state, event.deltaY, anchorX)
    })
  }

  return (
    <section className="timeline-shell" aria-label="Timeline interaction surface">
      <div
        ref={ref}
        className="timeline-surface"
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
