import { useEffect, useMemo, useRef, useState } from 'react'

import { ActionSidebar } from '../components/layout/action-sidebar'
import { MemoryDetailsPanel } from '../components/memories/memory-details-panel'
import { ThemeDetailsPanel } from '../components/themes/theme-details-panel'
import { TimelineSurface } from '../components/timeline/timeline-surface'
import { createMemory, deleteMemory, listMemories, updateMemory } from '../services/memories/memory-api'
import { type MemoryItem, type MemoryUpdateRequest } from '../services/memories/memory-types'
import { createTheme, deleteTheme, listThemes, updateTheme } from '../services/themes/theme-api'
import { clampThemeOpacity } from '../services/themes/theme-geometry'
import { type ThemeItem, type ThemeUpdateRequest } from '../services/themes/theme-types'

export default function TimelinePage() {
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [themes, setThemes] = useState<ThemeItem[]>([])
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [mode, setMode] = useState<'none' | 'memory' | 'theme'>('none')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isResizePinned, setIsResizePinned] = useState(false)
  const [isShiftDown, setIsShiftDown] = useState(false)
  const isResizePinnedRef = useRef(false)
  const isShiftDownRef = useRef(false)

  const [editModeMemoryId, setEditModeMemoryId] = useState<string | null>(null)
  const [draftMemoryId, setDraftMemoryId] = useState<string | null>(null)
  const [editModeThemeId, setEditModeThemeId] = useState<string | null>(null)
  const [draftThemeId, setDraftThemeId] = useState<string | null>(null)

  useEffect(() => {
    void listMemories().then(setMemories).catch(() => setMemories([]))
    void listThemes().then(setThemes).catch(() => setThemes([]))
  }, [])

  useEffect(() => {
    isResizePinnedRef.current = isResizePinned
  }, [isResizePinned])

  useEffect(() => {
    isShiftDownRef.current = isShiftDown
  }, [isShiftDown])

  const clearResizeSelections = () => {
    setSelectedMemoryId(null)
    setSelectedThemeId(null)
    setEditModeMemoryId(null)
    setEditModeThemeId(null)
  }

  useEffect(() => {
    const isEditingElement = (el: Element | null): boolean => {
      if (!(el instanceof HTMLElement)) return false
      if (el.isContentEditable) return true
      const tag = el.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
      return false
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        if (isEditingElement(document.activeElement)) {
          return
        }
        setIsShiftDown(true)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        if (!isShiftDownRef.current) {
          return
        }
        if (!isResizePinnedRef.current) {
          clearResizeSelections()
        }
        setIsShiftDown(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const selectedMemory = useMemo(
    () => memories.find((memory) => memory.id === selectedMemoryId) ?? null,
    [memories, selectedMemoryId],
  )
  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === selectedThemeId) ?? null,
    [themes, selectedThemeId],
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
    setSelectedThemeId(null)
    setEditModeMemoryId(created.id)
    setDraftMemoryId(created.id)
    setMode('none')
    setSidebarOpen(false)
  }

  const createThemeRange = async (startMs: number, endMs: number, topPx: number, bottomPx: number) => {
    const created = await createTheme({
      startTime: new Date(startMs).toISOString(),
      endTime: new Date(endMs).toISOString(),
      title: 'Untitled Theme',
      description: '',
      tags: ['theme'],
      color: '#3b82f6',
      opacity: 0.3,
      priority: 100,
      topPx,
      bottomPx,
    })
    setThemes((current) => [...current, created])
    setSelectedThemeId(created.id)
    setSelectedMemoryId(null)
    setEditModeThemeId(created.id)
    setDraftThemeId(created.id)
    setMode('none')
    setSidebarOpen(false)
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

  const saveTheme = async (themeId: string, payload: ThemeUpdateRequest) => {
    const updated = await updateTheme(themeId, {
      ...payload,
      opacity: payload.opacity == null ? undefined : clampThemeOpacity(payload.opacity),
    })
    setThemes((current) => current.map((theme) => (theme.id === themeId ? updated : theme)))
    setSelectedThemeId(themeId)
    setEditModeThemeId(null)
    if (draftThemeId === themeId) {
      setDraftThemeId(null)
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

  const discardDraftTheme = async (themeId: string) => {
    await deleteTheme(themeId)
    setThemes((current) => current.filter((theme) => theme.id !== themeId))
    setSelectedThemeId(null)
    setEditModeThemeId(null)
    if (draftThemeId === themeId) {
      setDraftThemeId(null)
    }
  }

  const deleteSelectedMemory = async (memoryId: string) => {
    await deleteMemory(memoryId)
    setMemories((current) => current.filter((memory) => memory.id !== memoryId))
    setSelectedMemoryId(null)
    setEditModeMemoryId(null)
  }

  const deleteSelectedTheme = async (themeId: string) => {
    await deleteTheme(themeId)
    setThemes((current) => current.filter((theme) => theme.id !== themeId))
    setSelectedThemeId(null)
    setEditModeThemeId(null)
  }

  const isResizeMode = isResizePinned || isShiftDown

  const modeMessage =
    mode === 'memory'
      ? 'Click timeline to place memory'
      : mode === 'theme'
        ? 'Click and drag above timeline to place theme'
        : isResizeMode
          ? 'Resize mode active. Drag memories or theme edges.'
          : 'Drag horizontally. Zoom to change scale.'

  return (
    <main className="timeline-page bg-white text-slate-900">
      <header className="timeline-header">
        <div>
          <p className="timeline-eyebrow">Timeline</p>
          <h1 className="mt-1 text-3xl font-semibold">Timeline Navigator</h1>
          <p className="mt-1 text-xs text-slate-500">{modeMessage}</p>
        </div>
        <div className="timeline-header-actions">
          <button
            type="button"
            data-testid="new-memory-button"
            className={`timeline-primary-button ${mode === 'memory' ? 'timeline-primary-button-active' : ''}`}
            onClick={() => {
              setMode((current) => (current === 'memory' ? 'none' : 'memory'))
              setSelectedMemoryId(null)
              setSelectedThemeId(null)
              setEditModeMemoryId(null)
              setEditModeThemeId(null)
              setSidebarOpen(false)
            }}
          >
            New Memory
          </button>
          <ActionSidebar
            open={sidebarOpen}
            mode={mode}
            resizeMode={isResizeMode}
            onToggle={() => setSidebarOpen((current) => !current)}
            onSelectMode={(nextMode) => {
              setMode((current) => (current === nextMode ? 'none' : nextMode))
              setSelectedMemoryId(null)
              setSelectedThemeId(null)
              setEditModeMemoryId(null)
              setEditModeThemeId(null)
              setSidebarOpen(false)
            }}
            onToggleResizeMode={() =>
              setIsResizePinned((current) => {
                const next = !current
                if (!next && !isShiftDown) {
                  clearResizeSelections()
                }
                return next
              })
            }
          />
        </div>
      </header>

      <div className="timeline-main flex w-full items-center justify-center">
        <TimelineSurface
          memories={memories}
          themes={themes}
          selectedMemoryId={selectedMemoryId}
          selectedThemeId={selectedThemeId}
          mode={mode}
          resizeMode={isResizeMode}
          onSelectMemory={(memoryId) => {
            setSelectedMemoryId(memoryId)
            setSelectedThemeId(null)
            setEditModeMemoryId(null)
            setMode('none')
            setSidebarOpen(false)
          }}
          onSelectTheme={(themeId) => {
            setSelectedThemeId(themeId)
            setSelectedMemoryId(null)
            setEditModeThemeId(null)
            setMode('none')
            setSidebarOpen(false)
          }}
          onPlaceMemoryAt={(timeMs, verticalRatio) => {
            void createAtTime(timeMs, verticalRatio)
          }}
          onCreateThemeRange={(startMs, endMs, topPx, bottomPx) => {
            void createThemeRange(startMs, endMs, topPx, bottomPx)
          }}
          onUpdateMemory={(memoryId, payload) => {
            void saveMemory(memoryId, payload)
          }}
          onUpdateTheme={(themeId, payload) => {
            void saveTheme(themeId, payload)
          }}
        />
      </div>

      <MemoryDetailsPanel
        memory={isResizeMode ? null : selectedMemory}
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

      <ThemeDetailsPanel
        theme={isResizeMode ? null : selectedTheme}
        startInEditMode={selectedThemeId != null && selectedThemeId === editModeThemeId}
        isNewlyCreated={selectedThemeId != null && selectedThemeId === draftThemeId}
        onSave={saveTheme}
        onDelete={deleteSelectedTheme}
        onDiscardNew={discardDraftTheme}
        onClose={() => {
          setSelectedThemeId(null)
          setEditModeThemeId(null)
        }}
      />
    </main>
  )
}
