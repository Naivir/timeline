import { useEffect, useMemo, useState } from 'react'

import { MemoryDetailsPanel } from '../components/memories/memory-details-panel'
import { TimelineSurface } from '../components/timeline/timeline-surface'
import { createMemory, deleteMemory, listMemories, undoDelete, updateMemory } from '../services/memories/memory-api'
import { type MemoryUpdateRequest } from '../services/memories/memory-types'
import { type MemoryItem } from '../services/memories/memory-types'

export default function TimelinePage() {
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [isPlacementArmed, setIsPlacementArmed] = useState(false)
  const [editModeMemoryId, setEditModeMemoryId] = useState<string | null>(null)
  const [draftMemoryId, setDraftMemoryId] = useState<string | null>(null)
  const [lastDeletionId, setLastDeletionId] = useState<string | null>(null)

  useEffect(() => {
    void listMemories().then(setMemories).catch(() => setMemories([]))
  }, [])

  const selectedMemory = useMemo(
    () => memories.find((memory) => memory.id === selectedMemoryId) ?? null,
    [memories, selectedMemoryId],
  )

  const createAtTime = async (timeMs: number, verticalRatio: number) => {
    const created = await createMemory({
      title: 'Untitled Memory',
      anchor: { type: 'point', timestamp: new Date(timeMs).toISOString() },
      tags: ['note'],
      verticalRatio,
    })
    setMemories((current) => [...current, created])
    setSelectedMemoryId(created.id)
    setEditModeMemoryId(created.id)
    setDraftMemoryId(created.id)
    setIsPlacementArmed(false)
  }

  const saveMemory = async (memoryId: string, payload: MemoryUpdateRequest) => {
    const updated = await updateMemory(memoryId, payload)
    setMemories((current) => current.map((memory) => (memory.id === memoryId ? updated : memory)))
    setSelectedMemoryId(memoryId)
    setEditModeMemoryId(null)
    if (draftMemoryId === memoryId) {
      setDraftMemoryId(null)
    }
  }

  const discardDraftMemory = async (memoryId: string) => {
    await deleteMemory(memoryId)
    setMemories((current) => current.filter((memory) => memory.id !== memoryId))
    setSelectedMemoryId(null)
    setEditModeMemoryId(null)
    if (draftMemoryId === memoryId) {
      setDraftMemoryId(null)
    }
  }

  const deleteSelectedMemory = async (memoryId: string) => {
    const deleted = await deleteMemory(memoryId)
    setMemories((current) => current.filter((memory) => memory.id !== memoryId))
    setLastDeletionId(deleted.deletionId)
    setSelectedMemoryId(null)
    setEditModeMemoryId(null)
  }

  const undoLastDelete = async () => {
    if (!lastDeletionId) return
    const restored = await undoDelete(lastDeletionId)
    setMemories((current) => [...current, restored])
    setSelectedMemoryId(restored.id)
    setLastDeletionId(null)
  }

  return (
    <main className="timeline-page bg-white text-slate-900">
      <header className="timeline-header">
        <div>
          <p className="timeline-eyebrow">Timeline</p>
          <h1 className="mt-1 text-3xl font-semibold">Timeline Navigator</h1>
          <p className="mt-1 text-xs text-slate-500">Drag horizontally. Zoom to change scale.</p>
        </div>
        <button
          type="button"
          data-testid="new-memory-button"
          className={`timeline-primary-button ${isPlacementArmed ? 'timeline-primary-button-active' : ''}`}
          onClick={() => {
            setIsPlacementArmed((current) => !current)
            setSelectedMemoryId(null)
            setEditModeMemoryId(null)
          }}
        >
          {isPlacementArmed ? 'Click timeline to place memory' : 'New Memory'}
        </button>
      </header>

      <div className="timeline-main flex w-full items-center justify-center">
        <TimelineSurface
          memories={memories}
          selectedMemoryId={selectedMemoryId}
          isPlacementArmed={isPlacementArmed}
          onSelectMemory={(memoryId) => {
            setSelectedMemoryId(memoryId)
            setEditModeMemoryId(null)
            setIsPlacementArmed(false)
          }}
          onPlaceMemoryAt={(timeMs, verticalRatio) => {
            void createAtTime(timeMs, verticalRatio)
          }}
          onUpdateMemory={(memoryId, payload) => {
            void saveMemory(memoryId, payload)
          }}
        />
      </div>
      {lastDeletionId ? (
        <div className="memory-undo-toast" data-testid="memory-undo-toast">
          <span>Memory deleted.</span>
          <button type="button" className="memory-primary-button" onClick={() => void undoLastDelete()}>
            Undo delete
          </button>
        </div>
      ) : null}
      <MemoryDetailsPanel
        memory={selectedMemory}
        startInEditMode={selectedMemoryId != null && selectedMemoryId === editModeMemoryId}
        isNewlyCreated={selectedMemoryId != null && selectedMemoryId === draftMemoryId}
        onSave={saveMemory}
        onDelete={deleteSelectedMemory}
        onDiscardNew={discardDraftMemory}
        onClose={() => {
          setSelectedMemoryId(null)
          setEditModeMemoryId(null)
        }}
      />
    </main>
  )
}
