import { useMemo, useRef } from 'react'

import { type MemoryItem, type MemoryUpdateRequest } from '../../services/memories/memory-types'
import { dragDeltaToTimeMs, resizeRangeEnd, resizeRangeStart } from '../../services/memories/memory-drag'
import { applyDeterministicDensity } from '../../services/memories/memory-density'
import { timeToX } from '../../services/timeline/time-scale-mapping'
import { MemoryMarker } from './memory-marker'
import { MemoryRange } from './memory-range'

type MemoryLayerProps = {
  memories: MemoryItem[]
  selectedId: string | null
  startMs: number
  endMs: number
  widthPx: number
  isPlacementArmed: boolean
  onSelect: (id: string | null) => void
  onCreateAt: (timeMs: number, verticalRatio: number) => void
  onUpdateMemory: (memoryId: string, payload: MemoryUpdateRequest) => void
}

function anchorToTimeMs(memory: MemoryItem): number {
  return memory.anchor.type === 'point'
    ? new Date(memory.anchor.timestamp).getTime()
    : new Date(memory.anchor.start).getTime()
}

type DragState =
  | { mode: 'point'; memory: MemoryItem; startX: number; moved: boolean }
  | { mode: 'range-body'; memory: MemoryItem; startX: number; moved: boolean }
  | {
      mode: 'range-handle'
      memory: MemoryItem
      startX: number
      side: 'start' | 'end'
      moved: boolean
    }

export function MemoryLayer({
  memories,
  selectedId,
  startMs,
  endMs,
  widthPx,
  isPlacementArmed,
  onSelect,
  onCreateAt,
  onUpdateMemory,
}: MemoryLayerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<DragState | null>(null)

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

  const commitDrag = (event: PointerEvent) => {
    const dragState = dragStateRef.current
    if (!dragState) return

    if (!dragState.moved) return

    const deltaX = event.clientX - dragState.startX
    const deltaMs = dragDeltaToTimeMs(deltaX, widthPx, startMs, endMs)

    if (dragState.mode === 'point') {
      if (dragState.memory.anchor.type !== 'point') return
      const nextTime = new Date(
        new Date(dragState.memory.anchor.timestamp).getTime() + deltaMs,
      ).toISOString()
      onUpdateMemory(dragState.memory.id, { anchor: { type: 'point', timestamp: nextTime } })
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
    if (Math.abs(event.clientX - dragState.startX) >= 4) {
      dragStateRef.current = { ...dragState, moved: true }
    }
  }

  const endDrag = (event: PointerEvent) => {
    commitDrag(event)
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

  return (
    <div
      ref={rootRef}
      className="memory-layer"
      data-testid="memory-layer"
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (target.closest('[data-memory-interactive="true"]')) return

        onSelect(null)
        if (!isPlacementArmed) return

        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const ratio = widthPx > 0 ? x / widthPx : 0
        const verticalRatio = rect.height > 0 ? y / rect.height : 0.3
        const timeMs = startMs + ratio * (endMs - startMs)
        onCreateAt(timeMs, verticalRatio)
      }}
    >
      {projected.map(({ memory, x, xStart, xEnd }) =>
        memory.anchor.type === 'range' ? (
          <MemoryRange
            key={memory.id}
            memory={memory}
            xStart={xStart ?? x}
            xEnd={xEnd ?? x}
            yRatio={memory.verticalRatio ?? 0.3}
            surfaceHeight={260}
            selected={memory.id === selectedId}
            onSelect={onSelect}
            onDragBodyStart={(dragMemory, clientX) => {
              startGlobalDrag({ mode: 'range-body', memory: dragMemory, startX: clientX, moved: false })
            }}
            onDragHandleStart={(dragMemory, side, clientX) => {
              startGlobalDrag({
                mode: 'range-handle',
                memory: dragMemory,
                side,
                startX: clientX,
                moved: false,
              })
            }}
          />
        ) : (
          <MemoryMarker
            key={memory.id}
            memory={memory}
            x={x}
            yRatio={memory.verticalRatio ?? 0.3}
            surfaceHeight={260}
            selected={memory.id === selectedId}
            onSelect={onSelect}
            onDragStart={(dragMemory, clientX) => {
              startGlobalDrag({ mode: 'point', memory: dragMemory, startX: clientX, moved: false })
            }}
          />
        ),
      )}
    </div>
  )
}
