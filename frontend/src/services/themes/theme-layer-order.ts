import type { ThemeItem } from './theme-types'

export function sortThemesForRender(themes: ThemeItem[]): ThemeItem[] {
  return [...themes].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (timeDiff !== 0) return timeDiff
    return a.id.localeCompare(b.id)
  })
}

export function pickTopmostTheme(themes: ThemeItem[]): ThemeItem | null {
  if (themes.length === 0) return null
  const sorted = sortThemesForRender(themes)
  return sorted[sorted.length - 1] ?? null
}

