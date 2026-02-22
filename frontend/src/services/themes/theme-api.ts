import { DEFAULT_SESSION_ID } from '../memories/memory-types'
import type { ThemeCreateRequest, ThemeItem, ThemeListResponse, ThemeUpdateRequest } from './theme-types'

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function listThemes(sessionId = DEFAULT_SESSION_ID): Promise<ThemeItem[]> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/themes`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('Failed to list themes')
  const payload = (await response.json()) as ThemeListResponse
  return payload.themes
}

export async function createTheme(payload: ThemeCreateRequest, sessionId = DEFAULT_SESSION_ID): Promise<ThemeItem> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/themes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to create theme')
  return (await response.json()) as ThemeItem
}

export async function updateTheme(themeId: string, payload: ThemeUpdateRequest, sessionId = DEFAULT_SESSION_ID): Promise<ThemeItem> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/themes/${themeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to update theme')
  return (await response.json()) as ThemeItem
}

export async function deleteTheme(themeId: string, sessionId = DEFAULT_SESSION_ID): Promise<void> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/themes/${themeId}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('Failed to delete theme')
}

