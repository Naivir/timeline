import { useMemo, useRef, useState } from 'react'

import { clampThemeHeight, normalizeThemeRange } from '../../services/themes/theme-geometry'
import { sortThemesForRender } from '../../services/themes/theme-layer-order'
import type { ThemeItem, ThemeUpdateRequest } from '../../services/themes/theme-types'
import { timeToX } from '../../services/timeline/time-scale-mapping'
import { ThemeBlock } from './theme-block'

type ThemeLayerProps = {
  themes: ThemeItem[]
  selectedThemeId: string | null
  startMs: number
  endMs: number
  widthPx: number
  surfaceHeight: number
  isInteractive: boolean
  isPlacementArmed: boolean
  resizeMode?: boolean
  onCreateTheme: (startMs: number, endMs: number) => void
  onSelectTheme: (themeId: string | null) => void
  onUpdateTheme: (themeId: string, payload: ThemeUpdateRequest) => void
}

type ThemeDragState = {
  type: 'move' | 'start' | 'end' | 'height' | 'corner-start' | 'corner-end'
  theme: ThemeItem
  startX: number
  startY: number
  initialStartMs: number
  initialEndMs: number
  initialHeight: number
}

export function ThemeLayer({
  themes,
  selectedThemeId,
  startMs,
  endMs,
  widthPx,
  surfaceHeight,
  isInteractive,
  isPlacementArmed,
  resizeMode = false,
  onCreateTheme,
  onSelectTheme,
  onUpdateTheme,
}: ThemeLayerProps) {
  const axisY = surfaceHeight * 0.5
  const [draftRange, setDraftRange] = useState<{ startX: number; endX: number } | null>(null)
  const placementStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragRef = useRef<ThemeDragState | null>(null)

  const ordered = useMemo(() => sortThemesForRender(themes), [themes])

  const projected = useMemo(
    () =>
      ordered.map((theme, index) => {
        const xStart = timeToX(new Date(theme.startTime).getTime(), startMs, endMs, widthPx)
        const xEnd = timeToX(new Date(theme.endTime).getTime(), startMs, endMs, widthPx)
        const left = Math.min(xStart, xEnd)
        const width = Math.max(8, Math.abs(xEnd - xStart))
        const height = clampThemeHeight(theme.heightPx)
        const top = axisY - height
        return {
          theme,
          left,
          width,
          top,
          height,
          zIndex: 1 + index,
        }
      }),
    [ordered, startMs, endMs, widthPx, axisY],
  )

  const startResize = (type: ThemeDragState['type'], theme: ThemeItem, clientX: number, clientY: number) => {
    dragRef.current = {
      type,
      theme,
      startX: clientX,
      startY: clientY,
      initialStartMs: new Date(theme.startTime).getTime(),
      initialEndMs: new Date(theme.endTime).getTime(),
      initialHeight: theme.heightPx,
    }

    const onMove = (event: PointerEvent) => {
      const active = dragRef.current
      if (!active) return
      const deltaX = event.clientX - active.startX
      const deltaY = event.clientY - active.startY
      const deltaMs = (deltaX / Math.max(widthPx, 1)) * (endMs - startMs)

      if (active.type === 'height') {
        const nextHeight = clampThemeHeight(active.initialHeight - deltaY)
        onUpdateTheme(active.theme.id, { heightPx: nextHeight })
        return
      }

      if (active.type === 'corner-start') {
        const normalized = normalizeThemeRange(active.initialStartMs + deltaMs, active.initialEndMs)
        const nextHeight = clampThemeHeight(active.initialHeight - deltaY)
        onUpdateTheme(active.theme.id, {
          startTime: new Date(normalized.startMs).toISOString(),
          endTime: new Date(normalized.endMs).toISOString(),
          heightPx: nextHeight,
        })
        return
      }

      if (active.type === 'corner-end') {
        const normalized = normalizeThemeRange(active.initialStartMs, active.initialEndMs + deltaMs)
        const nextHeight = clampThemeHeight(active.initialHeight - deltaY)
        onUpdateTheme(active.theme.id, {
          startTime: new Date(normalized.startMs).toISOString(),
          endTime: new Date(normalized.endMs).toISOString(),
          heightPx: nextHeight,
        })
        return
      }

      if (active.type === 'move') {
        onUpdateTheme(active.theme.id, {
          startTime: new Date(active.initialStartMs + deltaMs).toISOString(),
          endTime: new Date(active.initialEndMs + deltaMs).toISOString(),
        })
        return
      }

      if (active.type === 'start') {
        const normalized = normalizeThemeRange(active.initialStartMs + deltaMs, active.initialEndMs)
        onUpdateTheme(active.theme.id, {
          startTime: new Date(normalized.startMs).toISOString(),
          endTime: new Date(normalized.endMs).toISOString(),
        })
        return
      }

      const normalized = normalizeThemeRange(active.initialStartMs, active.initialEndMs + deltaMs)
      onUpdateTheme(active.theme.id, {
        startTime: new Date(normalized.startMs).toISOString(),
        endTime: new Date(normalized.endMs).toISOString(),
      })
    }

    const onEnd = () => {
      dragRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onEnd)
  }

  return (
    <div
      className={`theme-layer ${isInteractive ? 'theme-layer-interactive' : ''} ${isPlacementArmed ? 'theme-layer-placement' : ''}`}
      data-testid="theme-layer"
      onPointerDown={(event) => {
        if (!isPlacementArmed || event.button !== 0) return
        const target = event.target as HTMLElement
        if (target.closest('[data-testid="theme-block"]')) return
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const y = event.clientY - rect.top
        if (y >= axisY) return
        const x = event.clientX - rect.left
        placementStartRef.current = { x, y }
        setDraftRange({ startX: x, endX: x })
      }}
      onPointerMove={(event) => {
        if (!placementStartRef.current) return
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
        setDraftRange({ startX: placementStartRef.current.x, endX: x })
      }}
      onPointerUp={(event) => {
        if (placementStartRef.current && isPlacementArmed) {
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
          const endX = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
          const startX = placementStartRef.current.x
          const startTime = startMs + (Math.min(startX, endX) / Math.max(widthPx, 1)) * (endMs - startMs)
          const endTime = startMs + (Math.max(startX, endX) / Math.max(widthPx, 1)) * (endMs - startMs)
          const normalized = normalizeThemeRange(startTime, endTime)
          onCreateTheme(normalized.startMs, normalized.endMs)
        } else if (!isPlacementArmed) {
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          const inHitOrder = [...projected].reverse().filter((item) => x >= item.left && x <= item.left + item.width && y >= item.top && y <= item.top + item.height)
          onSelectTheme(inHitOrder[0]?.theme.id ?? null)
        }

        placementStartRef.current = null
        setDraftRange(null)
      }}
      onPointerCancel={() => {
        placementStartRef.current = null
        setDraftRange(null)
      }}
    >
      {projected.map((item) => (
        <ThemeBlock
          key={item.theme.id}
          theme={item.theme}
          left={item.left}
          width={item.width}
          top={item.top}
          height={item.height}
          zIndex={item.zIndex}
          selected={item.theme.id === selectedThemeId}
          resizeMode={resizeMode}
          onSelect={onSelectTheme}
          onStartDrag={startResize}
        />
      ))}

      {draftRange ? (
        <div
          className="theme-draft"
          data-testid="theme-draft"
          style={{
            left: `${Math.min(draftRange.startX, draftRange.endX)}px`,
            width: `${Math.max(4, Math.abs(draftRange.endX - draftRange.startX))}px`,
            top: `${axisY - 96}px`,
            height: '96px',
          }}
        />
      ) : null}
    </div>
  )
}
