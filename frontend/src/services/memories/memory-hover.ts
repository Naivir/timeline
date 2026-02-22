import type { MemoryItem } from './memory-types'

export const MEMORY_HOVER_DELAY_MS = 120

export function buildMemoryHoverSnippet(memory: MemoryItem): string {
  const raw = (memory.description ?? '').trim()
  if (!raw) return ''
  const words = raw.split(/\s+/).slice(0, 4)
  return words.join(' ')
}

