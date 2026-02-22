import type { CSSProperties } from 'react'
import type { MemoryItem } from '../../services/memories/memory-types'

const MARKER_SIZE_PX = 34
const MARKER_HALF_PX = MARKER_SIZE_PX / 2

export function computeMemoryBranchStyle(yRatio: number, surfaceHeight: number): CSSProperties {
  const safeYRatio = Math.max(0, Math.min(1, yRatio))
  const axisY = surfaceHeight * 0.5
  const markerCenterY = safeYRatio * surfaceHeight
  const markerTop = markerCenterY - MARKER_HALF_PX
  const markerBottom = markerCenterY + MARKER_HALF_PX

  if (markerBottom <= axisY) {
    // Marker above axis: extend line downward from marker bottom to axis.
    return {
      top: '100%',
      height: `${Math.max(0, axisY - markerBottom)}px`,
    }
  }

  if (markerTop >= axisY) {
    // Marker below axis: extend line upward from marker top to axis.
    return {
      bottom: '100%',
      height: `${Math.max(0, markerTop - axisY)}px`,
    }
  }

  // Marker intersects axis region.
  return { height: '0px' }
}

type MemoryMarkerProps = {
  memory: MemoryItem
  x: number
  yRatio: number
  surfaceHeight: number
  selected: boolean
  onSelect: (memoryId: string) => void
  onDragStart: (memory: MemoryItem, clientX: number) => void
}

export function MemoryMarker({ memory, x, yRatio, surfaceHeight, selected, onSelect, onDragStart }: MemoryMarkerProps) {
  const safeYRatio = Math.max(0, Math.min(1, yRatio))
  const branchStyle = computeMemoryBranchStyle(safeYRatio, surfaceHeight)

  return (
    <button
      type="button"
      className={`memory-marker ${selected ? 'memory-marker-selected' : ''}`}
      data-memory-interactive="true"
      data-testid="memory-marker"
      style={{ left: `${x}px`, top: `${safeYRatio * surfaceHeight - MARKER_HALF_PX}px` }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(memory.id)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        if (!selected) return
        if (event.button !== 0) return
        onDragStart(memory, event.clientX)
      }}
      title={memory.title}
      aria-label={`Memory: ${memory.title}`}
    >
      <span className="memory-marker-branch" aria-hidden="true" style={branchStyle} />
      <span className="memory-marker-icon" aria-hidden="true">
        📘
      </span>
    </button>
  )
}
