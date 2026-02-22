import { useEffect, useMemo, useRef, useState } from 'react'

import { MemoryLayer } from '../../components/memories/memory-layer'
import { ThemeLayer } from '../../components/themes/theme-layer'
import type { MemoryItem, MemoryUpdateRequest } from '../../services/memories/memory-types'
import type { ThemeItem, ThemeUpdateRequest } from '../../services/themes/theme-types'
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

export const TIMELINE_SURFACE_HEIGHT_PX = 520

type TimelineSurfaceProps = {
  memories?: MemoryItem[]
  themes?: ThemeItem[]
  selectedMemoryId?: string | null
  selectedThemeId?: string | null
  onSelectMemory?: (memoryId: string | null) => void
  onSelectTheme?: (themeId: string | null) => void
  onPlaceMemoryAt?: (timeMs: number, verticalRatio: number) => void
  onCreateThemeRange?: (startMs: number, endMs: number, topPx: number, bottomPx: number) => void
  onUpdateMemory?: (memoryId: string, payload: MemoryUpdateRequest) => void
  onUpdateTheme?: (themeId: string, payload: ThemeUpdateRequest) => void
  mode?: 'none' | 'memory' | 'theme'
  resizeMode?: boolean
}

export function TimelineSurface({
  memories = [],
  themes = [],
  selectedMemoryId = null,
  selectedThemeId = null,
  onSelectMemory,
  onSelectTheme,
  onPlaceMemoryAt,
  onCreateThemeRange,
  onUpdateMemory,
  onUpdateTheme,
  mode = 'none',
  resizeMode = false,
}: TimelineSurfaceProps) {
  const [timelineState, setTimelineState] = useState<TimelineState>(() => createInitialTimelineState())
  const [isDragging, setIsDragging] = useState(false)
  const [lastX, setLastX] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  const verticalWheelStateRef = useRef(createVerticalWheelZoomState())

  const isMemoryPlacementArmed = mode === 'memory'
  const isThemePlacementArmed = mode === 'theme'

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
    if (isMemoryPlacementArmed || isThemePlacementArmed) return
    setIsDragging(true)
    setLastX(event.clientX)
    if ('setPointerCapture' in event.currentTarget) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (isMemoryPlacementArmed || isThemePlacementArmed) return
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

    const target = event.target as HTMLElement
    const clickedInteractive =
      target.closest('[data-memory-interactive="true"]') != null ||
      target.closest('[data-testid="theme-block"]') != null

    if (!clickedInteractive && isMemoryPlacementArmed) {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const ratio = timelineState.widthPx > 0 ? x / timelineState.widthPx : 0
      const verticalRatio = rect.height > 0 ? y / rect.height : 0.3
      const timeMs = timelineState.startMs + ratio * (timelineState.endMs - timelineState.startMs)
      onPlaceMemoryAt?.(timeMs, verticalRatio)
      return
    }

    if (!clickedInteractive && !isMemoryPlacementArmed && !isThemePlacementArmed) {
      onSelectMemory?.(null)
      onSelectTheme?.(null)
    }
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
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
        className={`timeline-surface ${isMemoryPlacementArmed || isThemePlacementArmed ? 'timeline-surface-placement' : ''} ${resizeMode ? 'timeline-surface-resize' : ''}`}
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

        <ThemeLayer
          themes={themes}
          selectedThemeId={selectedThemeId}
          startMs={timelineState.startMs}
          endMs={timelineState.endMs}
          widthPx={timelineState.widthPx}
          surfaceHeight={TIMELINE_SURFACE_HEIGHT_PX}
          isInteractive={!isMemoryPlacementArmed && (isThemePlacementArmed || themes.length > 0)}
          isPlacementArmed={isThemePlacementArmed}
          resizeMode={resizeMode}
          onCreateTheme={(s, e, topPx, bottomPx) => onCreateThemeRange?.(s, e, topPx, bottomPx)}
          onSelectTheme={(themeId) => onSelectTheme?.(themeId)}
          onUpdateTheme={(themeId, payload) => onUpdateTheme?.(themeId, payload)}
        />

        <div className="timeline-line" aria-label="Timeline axis" />

        <MemoryLayer
          memories={memories}
          selectedId={selectedMemoryId}
          startMs={timelineState.startMs}
          endMs={timelineState.endMs}
          widthPx={timelineState.widthPx}
          surfaceHeight={TIMELINE_SURFACE_HEIGHT_PX}
          onSelect={(id) => onSelectMemory?.(id)}
          onUpdateMemory={(memoryId, payload) => onUpdateMemory?.(memoryId, payload)}
          resizeMode={resizeMode}
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
