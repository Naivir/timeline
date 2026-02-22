import { DEFAULT_SESSION_ID, type MemoryCreateRequest, type MemoryItem, type MemoryListResponse, type MemoryUpdateRequest } from './memory-types'

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function listMemories(sessionId = DEFAULT_SESSION_ID, signal?: AbortSignal): Promise<MemoryItem[]> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/memories`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  })
  if (!response.ok) {
    throw new Error('Failed to list memories')
  }
  const payload = (await response.json()) as MemoryListResponse
  return payload.memories
}

export async function createMemory(payload: MemoryCreateRequest, sessionId = DEFAULT_SESSION_ID): Promise<MemoryItem> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    throw new Error('Failed to create memory')
  }
  return (await response.json()) as MemoryItem
}

export async function updateMemory(memoryId: string, payload: MemoryUpdateRequest, sessionId = DEFAULT_SESSION_ID): Promise<MemoryItem> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/memories/${memoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    throw new Error('Failed to update memory')
  }
  return (await response.json()) as MemoryItem
}

export async function deleteMemory(memoryId: string, sessionId = DEFAULT_SESSION_ID): Promise<void> {
  const response = await fetch(`${apiBase}/api/v1/sessions/${sessionId}/memories/${memoryId}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' }
  })
  if (!response.ok) {
    throw new Error('Failed to delete memory')
  }
  return
}
