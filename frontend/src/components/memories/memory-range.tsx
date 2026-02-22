import type { MemoryItem } from '../../services/memories/memory-types'

type MemoryRangeProps = {
  memory: MemoryItem
  xStart: number
  xEnd: number
  yRatio: number
  surfaceHeight: number
  selected: boolean
  onSelect: (memoryId: string) => void
  onDragBodyStart: (memory: MemoryItem, clientX: number, clientY: number) => void
  onDragHandleStart: (
    memory: MemoryItem,
    side: 'start' | 'end',
    clientX: number,
    clientY: number,
  ) => void
  resizeMode?: boolean
}

export function MemoryRange({
  memory,
  xStart,
  xEnd,
  yRatio,
  surfaceHeight,
  selected,
  onSelect,
  onDragBodyStart,
  onDragHandleStart,
  resizeMode = false,
}: MemoryRangeProps) {
  const safeYRatio = Math.max(0, Math.min(1, yRatio))
  const left = Math.min(xStart, xEnd)
  const width = Math.max(10, Math.abs(xEnd - xStart))

  return (
    <div
      className={`memory-range ${selected ? 'memory-range-selected' : ''}`}
      style={{ left: `${left}px`, top: `${safeYRatio * surfaceHeight - 8}px`, width: `${width}px` }}
      data-memory-interactive="true"
      data-testid="memory-range"
      onClick={(event) => {
        event.stopPropagation()
        onSelect(memory.id)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        if (!resizeMode) return
        if (event.button !== 0) return
        onSelect(memory.id)
        onDragBodyStart(memory, event.clientX, event.clientY)
      }}
      aria-label={`Range memory: ${memory.title}`}
      role="button"
      tabIndex={0}
    >
      {selected ? (
        <>
          <button
            type="button"
            className="memory-range-handle memory-range-handle-start"
            aria-label="Adjust range start"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (!resizeMode) return
              if (event.button !== 0) return
              onSelect(memory.id)
              onDragHandleStart(memory, 'start', event.clientX, event.clientY)
            }}
          />
          <button
            type="button"
            className="memory-range-handle memory-range-handle-end"
            aria-label="Adjust range end"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (!resizeMode) return
              if (event.button !== 0) return
              onSelect(memory.id)
              onDragHandleStart(memory, 'end', event.clientX, event.clientY)
            }}
          />
        </>
      ) : null}
    </div>
  )
}
