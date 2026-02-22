import type { ThemeItem } from '../../services/themes/theme-types'

type ThemeBlockProps = {
  theme: ThemeItem
  left: number
  width: number
  top: number
  height: number
  zIndex: number
  selected: boolean
  resizeMode?: boolean
  onSelect: (themeId: string) => void
  onStartDrag: (
    kind: 'move' | 'start' | 'end' | 'height' | 'corner-start' | 'corner-end',
    theme: ThemeItem,
    clientX: number,
    clientY: number,
  ) => void
}

export function ThemeBlock({
  theme,
  left,
  width,
  top,
  height,
  zIndex,
  selected,
  resizeMode = false,
  onSelect,
  onStartDrag,
}: ThemeBlockProps) {
  const showInlineTitle = width >= 120 && height >= 42

  return (
    <div
      className={`theme-block ${selected ? 'theme-block-selected' : ''}`}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        top: `${top}px`,
        height: `${height}px`,
        zIndex,
        backgroundColor: `${theme.color}${Math.round(theme.opacity * 255)
          .toString(16)
          .padStart(2, '0')}`,
      }}
      data-testid="theme-block"
      data-theme-id={theme.id}
      aria-label={`Theme: ${theme.title}`}
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(theme.id)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        if (!resizeMode || event.button !== 0) return
        onSelect(theme.id)
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const localX = event.clientX - rect.left
        const localY = event.clientY - rect.top
        const edgeThreshold = 18
        const nearTop = localY <= edgeThreshold
        const nearStart = localX <= edgeThreshold
        const nearEnd = localX >= rect.width - edgeThreshold

        if (nearTop && nearStart) {
          onStartDrag('corner-start', theme, event.clientX, event.clientY)
          return
        }
        if (nearTop && nearEnd) {
          onStartDrag('corner-end', theme, event.clientX, event.clientY)
          return
        }
        if (nearTop) {
          onStartDrag('height', theme, event.clientX, event.clientY)
          return
        }
        if (nearStart) {
          onStartDrag('start', theme, event.clientX, event.clientY)
          return
        }
        if (nearEnd) {
          onStartDrag('end', theme, event.clientX, event.clientY)
          return
        }
        onStartDrag('move', theme, event.clientX, event.clientY)
      }}
      title={!showInlineTitle && !resizeMode ? theme.title : undefined}
    >
      {showInlineTitle ? <span className="theme-block-title">{theme.title}</span> : null}
      {selected && resizeMode ? (
        <>
          <span
            className="theme-handle theme-handle-start"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('start', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-end"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('end', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-height"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('height', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-corner-start"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('corner-start', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-corner-end"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('corner-end', theme, event.clientX, event.clientY)
            }}
          />
        </>
      ) : null}
    </div>
  )
}
