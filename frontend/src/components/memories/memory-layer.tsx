import { useEffect, useMemo, useRef, useState } from 'react'

import { type MemoryItem, type MemoryUpdateRequest } from '../../services/memories/memory-types'
import { clampVerticalRatio, dragDeltaToTimeMs, resizeRangeEnd, resizeRangeStart } from '../../services/memories/memory-drag'
import { applyDeterministicDensity } from '../../services/memories/memory-density'
import { buildMemoryHoverSnippet, MEMORY_HOVER_DELAY_MS } from '../../services/memories/memory-hover'
import { timeToX } from '../../services/timeline/time-scale-mapping'
import { MemoryMarker } from './memory-marker'
import { MemoryRange } from './memory-range'

type MemoryLayerProps = {
  memories: MemoryItem[]
  selectedId: string | null
  startMs: number
  endMs: number
  widthPx: number
  surfaceHeight: number
  onSelect: (id: string | null) => void
  onUpdateMemory: (memoryId: string, payload: MemoryUpdateRequest) => void
  resizeMode?: boolean
}

function anchorToTimeMs(memory: MemoryItem): number {
  return memory.anchor.type === 'point'
    ? new Date(memory.anchor.timestamp).getTime()
    : new Date(memory.anchor.start).getTime()
}

type DragState =
  | { mode: 'point'; memory: MemoryItem; startX: number; startY: number; moved: boolean }
  | {
      mode: 'range-body'
      memory: MemoryItem
      startX: number
      startY: number
      moved: boolean
    }
  | {
      mode: 'range-handle'
      memory: MemoryItem
      startX: number
      startY: number
      side: 'start' | 'end'
      moved: boolean
    }

export function MemoryLayer({
  memories,
  selectedId,
  startMs,
  endMs,
  widthPx,
  surfaceHeight,
  onSelect,
  onUpdateMemory,
  resizeMode = false,
}: MemoryLayerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const hoverTimerRef = useRef<number | null>(null)
  const [hoverPreview, setHoverPreview] = useState<{
    memory: MemoryItem
    x: number
    yRatio: number
  } | null>(null)
  const hoverSnippet = hoverPreview ? buildMemoryHoverSnippet(hoverPreview.memory) : ''

  const projected = useMemo(
    () =>
      applyDeterministicDensity(memories, selectedId, memories.length).map((memory) => ({
        memory,
        x: timeToX(anchorToTimeMs(memory), startMs, endMs, widthPx),
        xStart:
          memory.anchor.type === 'range'
            ? timeToX(new Date(memory.anchor.start).getTime(), startMs, endMs, widthPx)
            : null,
        xEnd:
          memory.anchor.type === 'range'
            ? timeToX(new Date(memory.anchor.end).getTime(), startMs, endMs, widthPx)
            : null,
      })),
    [memories, startMs, endMs, widthPx],
  )

  const applyDrag = (event: PointerEvent) => {
    const dragState = dragStateRef.current
    if (!dragState) return

    if (!dragState.moved) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    const deltaMs = dragDeltaToTimeMs(deltaX, widthPx, startMs, endMs)
    const deltaRatio = surfaceHeight > 0 ? deltaY / surfaceHeight : 0

    if (dragState.mode === 'point') {
      if (dragState.memory.anchor.type !== 'point') return
      const nextTime = new Date(
        new Date(dragState.memory.anchor.timestamp).getTime() + deltaMs,
      ).toISOString()
      onUpdateMemory(dragState.memory.id, {
        anchor: { type: 'point', timestamp: nextTime },
        verticalRatio: clampVerticalRatio((dragState.memory.verticalRatio ?? 0.3) + deltaRatio),
      })
      return
    }

    if (dragState.memory.anchor.type !== 'range') return
    const currentStart = new Date(dragState.memory.anchor.start).getTime()
    const currentEnd = new Date(dragState.memory.anchor.end).getTime()

    if (dragState.mode === 'range-body') {
      const nextStart = new Date(currentStart + deltaMs).toISOString()
      const nextEnd = new Date(currentEnd + deltaMs).toISOString()
      onUpdateMemory(dragState.memory.id, {
        anchor: { type: 'range', start: nextStart, end: nextEnd },
        verticalRatio: clampVerticalRatio((dragState.memory.verticalRatio ?? 0.3) + deltaRatio),
      })
      return
    }

    if (dragState.side === 'start') {
      const nextStartMs = resizeRangeStart(currentStart, currentEnd, currentStart + deltaMs)
      onUpdateMemory(dragState.memory.id, {
        anchor: {
          type: 'range',
          start: new Date(nextStartMs).toISOString(),
          end: new Date(currentEnd).toISOString(),
        },
      })
      return
    }

    const nextEndMs = resizeRangeEnd(currentStart, currentEnd, currentEnd + deltaMs)
    onUpdateMemory(dragState.memory.id, {
      anchor: {
        type: 'range',
        start: new Date(currentStart).toISOString(),
        end: new Date(nextEndMs).toISOString(),
      },
    })
  }

  const onGlobalPointerMove = (event: PointerEvent) => {
    const dragState = dragStateRef.current
    if (!dragState) return
    const dx = event.clientX - dragState.startX
    const dy = event.clientY - dragState.startY
    if (Math.hypot(dx, dy) >= 4) {
      dragStateRef.current = { ...dragState, moved: true }
    }
    applyDrag(event)
  }

  const endDrag = (event: PointerEvent) => {
    applyDrag(event)
    dragStateRef.current = null
    window.removeEventListener('pointermove', onGlobalPointerMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
  }

  const startGlobalDrag = (drag: DragState) => {
    dragStateRef.current = drag
    window.addEventListener('pointermove', onGlobalPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
  }

  const clearHoverTimer = () => {
    if (hoverTimerRef.current == null) return
    window.clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = null
  }

  useEffect(() => {
    if (!resizeMode) return
    clearHoverTimer()
    setHoverPreview(null)
  }, [resizeMode])

  return (
    <div ref={rootRef} className="memory-layer" data-testid="memory-layer">
      {projected.map(({ memory, x, xStart, xEnd }) =>
        memory.anchor.type === 'range' ? (
          <MemoryRange
            key={memory.id}
            memory={memory}
            xStart={xStart ?? x}
            xEnd={xEnd ?? x}
            yRatio={memory.verticalRatio ?? 0.3}
            surfaceHeight={surfaceHeight}
            selected={memory.id === selectedId}
            onSelect={onSelect}
            onDragBodyStart={(dragMemory, clientX, clientY) => {
              if (!resizeMode) return
              startGlobalDrag({
                mode: 'range-body',
                memory: dragMemory,
                startX: clientX,
                startY: clientY,
                moved: false,
              })
            }}
            onDragHandleStart={(dragMemory, side, clientX, clientY) => {
              startGlobalDrag({
                mode: 'range-handle',
                memory: dragMemory,
                side,
                startX: clientX,
                startY: clientY,
                moved: false,
              })
            }}
            resizeMode={resizeMode}
          />
        ) : (
          <MemoryMarker
            key={memory.id}
            memory={memory}
            x={x}
            yRatio={memory.verticalRatio ?? 0.3}
            surfaceHeight={surfaceHeight}
            selected={memory.id === selectedId}
            onSelect={onSelect}
            onDragStart={(dragMemory, clientX, clientY) => {
              if (!resizeMode) return
              startGlobalDrag({
                mode: 'point',
                memory: dragMemory,
                startX: clientX,
                startY: clientY,
                moved: false,
              })
            }}
            onHoverStart={(hoverMemory, hoverX, hoverYRatio) => {
              if (resizeMode) return
              clearHoverTimer()
              hoverTimerRef.current = window.setTimeout(() => {
                setHoverPreview({ memory: hoverMemory, x: hoverX, yRatio: hoverYRatio })
              }, MEMORY_HOVER_DELAY_MS)
            }}
            onHoverEnd={() => {
              clearHoverTimer()
              setHoverPreview(null)
            }}
            resizeMode={resizeMode}
          />
        ),
      )}
      {hoverPreview ? (
        <div
          className="memory-hover-tooltip"
          data-testid="memory-hover-tooltip"
          style={{
            left: `${hoverPreview.x}px`,
            top: `${Math.max(8, hoverPreview.yRatio * surfaceHeight - 48)}px`,
          }}
        >
          <strong>{hoverPreview.memory.title}</strong>
          {hoverSnippet ? (
            <span>{hoverSnippet}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
