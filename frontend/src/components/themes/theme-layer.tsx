import { useMemo, useRef, useState } from 'react'

import {
  applyThemeCornerResize,
  applyThemeTranslation,
  normalizeThemeRange,
  normalizeThemeVerticalBounds,
  snapTo4Px,
} from '../../services/themes/theme-geometry'
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
  onCreateTheme: (startMs: number, endMs: number, topPx: number, bottomPx: number) => void
  onSelectTheme: (themeId: string | null) => void
  onUpdateTheme: (themeId: string, payload: ThemeUpdateRequest) => void
}

type ThemeDragState = {
  type:
    | 'move'
    | 'start'
    | 'end'
    | 'top'
    | 'bottom'
    | 'corner-top-start'
    | 'corner-top-end'
    | 'corner-bottom-start'
    | 'corner-bottom-end'
  theme: ThemeItem
  startX: number
  startY: number
  initialStartMs: number
  initialEndMs: number
  initialTopPx: number
  initialBottomPx: number
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
  const [draftRect, setDraftRect] = useState<{ startX: number; endX: number; topPx: number; bottomPx: number } | null>(null)
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
        const fallbackHeight = theme.heightPx ?? 96
        const top = snapTo4Px(theme.topPx ?? axisY - fallbackHeight)
        const bottom = snapTo4Px(theme.bottomPx ?? axisY)
        const height = Math.max(24, bottom - top)
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
      initialTopPx: theme.topPx ?? axisY - (theme.heightPx ?? 96),
      initialBottomPx: theme.bottomPx ?? axisY,
    }

    const onMove = (event: PointerEvent) => {
      const active = dragRef.current
      if (!active) return
      const deltaX = event.clientX - active.startX
      const deltaY = event.clientY - active.startY
      const deltaMs = (deltaX / Math.max(widthPx, 1)) * (endMs - startMs)

      if (active.type === 'top') {
        const nextTop = Math.max(0, Math.min(active.initialBottomPx - 24, snapTo4Px(active.initialTopPx + deltaY)))
        onUpdateTheme(active.theme.id, { topPx: nextTop, heightPx: active.initialBottomPx - nextTop })
        return
      }

      if (active.type === 'bottom') {
        const nextBottom = Math.max(active.initialTopPx + 24, Math.min(axisY, snapTo4Px(active.initialBottomPx + deltaY)))
        onUpdateTheme(active.theme.id, { bottomPx: nextBottom, heightPx: nextBottom - active.initialTopPx })
        return
      }

      if (active.type === 'move') {
        const translated = applyThemeTranslation({
          initialStartMs: active.initialStartMs,
          initialEndMs: active.initialEndMs,
          initialTopPx: active.initialTopPx,
          initialBottomPx: active.initialBottomPx,
          deltaMs,
          deltaYPx: deltaY,
          axisY,
        })
        onUpdateTheme(active.theme.id, {
          startTime: new Date(translated.startMs).toISOString(),
          endTime: new Date(translated.endMs).toISOString(),
          topPx: translated.topPx,
          bottomPx: translated.bottomPx,
          heightPx: translated.bottomPx - translated.topPx,
        })
        return
      }

      if (active.type === 'corner-bottom-start') {
        const resized = applyThemeCornerResize({
          corner: 'bottom-left',
          initialStartMs: active.initialStartMs,
          initialEndMs: active.initialEndMs,
          initialTopPx: active.initialTopPx,
          initialBottomPx: active.initialBottomPx,
          deltaMs,
          deltaYPx: deltaY,
          axisY,
        })
        onUpdateTheme(active.theme.id, {
          startTime: new Date(resized.startMs).toISOString(),
          endTime: new Date(resized.endMs).toISOString(),
          topPx: resized.topPx,
          bottomPx: resized.bottomPx,
          heightPx: resized.bottomPx - resized.topPx,
        })
        return
      }

      if (active.type === 'corner-bottom-end') {
        const resized = applyThemeCornerResize({
          corner: 'bottom-right',
          initialStartMs: active.initialStartMs,
          initialEndMs: active.initialEndMs,
          initialTopPx: active.initialTopPx,
          initialBottomPx: active.initialBottomPx,
          deltaMs,
          deltaYPx: deltaY,
          axisY,
        })
        onUpdateTheme(active.theme.id, {
          startTime: new Date(resized.startMs).toISOString(),
          endTime: new Date(resized.endMs).toISOString(),
          topPx: resized.topPx,
          bottomPx: resized.bottomPx,
          heightPx: resized.bottomPx - resized.topPx,
        })
        return
      }

      if (active.type === 'corner-top-start') {
        const resized = applyThemeCornerResize({
          corner: 'top-left',
          initialStartMs: active.initialStartMs,
          initialEndMs: active.initialEndMs,
          initialTopPx: active.initialTopPx,
          initialBottomPx: active.initialBottomPx,
          deltaMs,
          deltaYPx: deltaY,
          axisY,
        })
        onUpdateTheme(active.theme.id, {
          startTime: new Date(resized.startMs).toISOString(),
          endTime: new Date(resized.endMs).toISOString(),
          topPx: resized.topPx,
          bottomPx: resized.bottomPx,
          heightPx: resized.bottomPx - resized.topPx,
        })
        return
      }

      if (active.type === 'corner-top-end') {
        const resized = applyThemeCornerResize({
          corner: 'top-right',
          initialStartMs: active.initialStartMs,
          initialEndMs: active.initialEndMs,
          initialTopPx: active.initialTopPx,
          initialBottomPx: active.initialBottomPx,
          deltaMs,
          deltaYPx: deltaY,
          axisY,
        })
        onUpdateTheme(active.theme.id, {
          startTime: new Date(resized.startMs).toISOString(),
          endTime: new Date(resized.endMs).toISOString(),
          topPx: resized.topPx,
          bottomPx: resized.bottomPx,
          heightPx: resized.bottomPx - resized.topPx,
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
        if ('setPointerCapture' in event.currentTarget) {
          event.currentTarget.setPointerCapture(event.pointerId)
        }
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const y = event.clientY - rect.top
        if (y >= axisY) return
        const x = event.clientX - rect.left
        placementStartRef.current = { x, y }
        const { topPx, bottomPx } = normalizeThemeVerticalBounds(y, y, axisY)
        setDraftRect({ startX: x, endX: x, topPx, bottomPx })
      }}
      onPointerMove={(event) => {
        if (!placementStartRef.current) return
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
        const y = Math.max(0, Math.min(axisY, event.clientY - rect.top))
        const { topPx, bottomPx } = normalizeThemeVerticalBounds(placementStartRef.current.y, y, axisY)
        setDraftRect({ startX: placementStartRef.current.x, endX: x, topPx, bottomPx })
      }}
      onPointerUp={(event) => {
        if (placementStartRef.current && isPlacementArmed) {
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
          const endX = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
          const startX = placementStartRef.current.x
          const startTime = startMs + (Math.min(startX, endX) / Math.max(widthPx, 1)) * (endMs - startMs)
          const endTime = startMs + (Math.max(startX, endX) / Math.max(widthPx, 1)) * (endMs - startMs)
          const normalized = normalizeThemeRange(startTime, endTime)
          const y = Math.max(0, Math.min(axisY, event.clientY - rect.top))
          const { topPx, bottomPx } = normalizeThemeVerticalBounds(placementStartRef.current.y, y, axisY)
          onCreateTheme(normalized.startMs, normalized.endMs, topPx, bottomPx)
        } else if (!isPlacementArmed) {
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          const inHitOrder = [...projected].reverse().filter((item) => x >= item.left && x <= item.left + item.width && y >= item.top && y <= item.top + item.height)
          onSelectTheme(inHitOrder[0]?.theme.id ?? null)
        }
        if ('releasePointerCapture' in event.currentTarget) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }

        placementStartRef.current = null
        setDraftRect(null)
      }}
      onPointerCancel={(event) => {
        if ('releasePointerCapture' in event.currentTarget) {
          try {
            event.currentTarget.releasePointerCapture(event.pointerId)
          } catch {
            // no-op
          }
        }
        placementStartRef.current = null
        setDraftRect(null)
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
          interactive={isInteractive}
          resizeMode={resizeMode}
          onSelect={onSelectTheme}
          onStartDrag={startResize}
        />
      ))}

      {draftRect ? (
        <div
          className="theme-draft"
          data-testid="theme-draft"
          style={{
            left: `${Math.min(draftRect.startX, draftRect.endX)}px`,
            width: `${Math.max(4, Math.abs(draftRect.endX - draftRect.startX))}px`,
            top: `${draftRect.topPx}px`,
            height: `${draftRect.bottomPx - draftRect.topPx}px`,
          }}
        />
      ) : null}
    </div>
  )
}
