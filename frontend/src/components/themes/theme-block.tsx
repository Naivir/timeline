import type { ThemeItem } from '../../services/themes/theme-types'

const FULL_TITLE_MIN_HEIGHT_PX = 16
const THEME_TEXT_HORIZONTAL_PADDING_PX = 14

function measureTextWidthPx(text: string): number {
  if (typeof document === 'undefined') {
    return text.length * 7
  }
  if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('jsdom')) {
    return text.length * 7
  }
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      return text.length * 7
    }
    context.font = '600 12px "Avenir Next", "Segoe UI", sans-serif'
    return context.measureText(text).width
  } catch {
    return text.length * 7
  }
}

function fitsHorizontally(text: string, widthPx: number): boolean {
  return measureTextWidthPx(text) + THEME_TEXT_HORIZONTAL_PADDING_PX <= widthPx
}

export function getThemeInlineTitle(input: {
  title: string
  abbreviatedTitle?: string | null
  widthPx: number
  heightPx: number
}): string | null {
  if (input.heightPx >= FULL_TITLE_MIN_HEIGHT_PX && fitsHorizontally(input.title, input.widthPx)) {
    return input.title
  }
  if (input.abbreviatedTitle && fitsHorizontally(input.abbreviatedTitle, input.widthPx)) {
    return input.abbreviatedTitle
  }
  return null
}

type ThemeBlockProps = {
  theme: ThemeItem
  left: number
  width: number
  top: number
  height: number
  zIndex: number
  selected: boolean
  interactive?: boolean
  resizeMode?: boolean
  onSelect: (themeId: string) => void
  onStartDrag: (
    kind:
      | 'move'
      | 'start'
      | 'end'
      | 'top'
      | 'bottom'
      | 'corner-top-start'
      | 'corner-top-end'
      | 'corner-bottom-start'
      | 'corner-bottom-end',
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
  interactive = true,
  resizeMode = false,
  onSelect,
  onStartDrag,
}: ThemeBlockProps) {
  const inlineTitle = getThemeInlineTitle({
    title: theme.title,
    abbreviatedTitle: theme.abbreviatedTitle,
    widthPx: width,
    heightPx: height,
  })

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
        pointerEvents: interactive ? 'auto' : 'none',
      }}
      data-testid="theme-block"
      data-theme-id={theme.id}
      aria-label={`Theme: ${theme.title}`}
      role="button"
      tabIndex={0}
      onClick={(event) => {
        if (!interactive) return
        event.stopPropagation()
        onSelect(theme.id)
      }}
      onPointerDown={(event) => {
        if (!interactive) return
        event.stopPropagation()
        if (!resizeMode || event.button !== 0) return
        onSelect(theme.id)
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
        const localX = event.clientX - rect.left
        const localY = event.clientY - rect.top
        const edgeThreshold = 18
        const nearTop = localY <= edgeThreshold
        const nearBottom = localY >= rect.height - edgeThreshold
        const nearStart = localX <= edgeThreshold
        const nearEnd = localX >= rect.width - edgeThreshold

        if (nearTop && nearStart) {
          onStartDrag('corner-top-start', theme, event.clientX, event.clientY)
          return
        }
        if (nearTop && nearEnd) {
          onStartDrag('corner-top-end', theme, event.clientX, event.clientY)
          return
        }
        if (nearBottom && nearStart) {
          onStartDrag('corner-bottom-start', theme, event.clientX, event.clientY)
          return
        }
        if (nearBottom && nearEnd) {
          onStartDrag('corner-bottom-end', theme, event.clientX, event.clientY)
          return
        }
        if (nearTop) {
          onStartDrag('top', theme, event.clientX, event.clientY)
          return
        }
        if (nearBottom) {
          onStartDrag('bottom', theme, event.clientX, event.clientY)
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
      title={!inlineTitle && !resizeMode ? theme.title : undefined}
    >
      {inlineTitle ? <span className="theme-block-title">{inlineTitle}</span> : null}
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
              onStartDrag('top', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-bottom"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('bottom', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-corner-top-start"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('corner-top-start', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-corner-top-end"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('corner-top-end', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-corner-start"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('corner-bottom-start', theme, event.clientX, event.clientY)
            }}
          />
          <span
            className="theme-handle theme-handle-corner-end"
            onPointerDown={(event) => {
              event.stopPropagation()
              if (event.button !== 0) return
              onStartDrag('corner-bottom-end', theme, event.clientX, event.clientY)
            }}
          />
        </>
      ) : null}
    </div>
  )
}
