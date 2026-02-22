import type { MemoryItem } from './memory-types'

function anchorMs(memory: MemoryItem): number {
  return memory.anchor.type === 'point'
    ? new Date(memory.anchor.timestamp).getTime()
    : new Date(memory.anchor.start).getTime()
}

export function applyDeterministicDensity(
  memories: MemoryItem[],
  selectedId: string | null,
  densitySignal: number,
): MemoryItem[] {
  let stride = 1
  if (densitySignal >= 80) stride = 3
  else if (densitySignal >= 40) stride = 2

  if (stride === 1) return memories

  const sorted = [...memories].sort((a, b) => {
    const delta = anchorMs(a) - anchorMs(b)
    return delta !== 0 ? delta : a.id.localeCompare(b.id)
  })

  const keepIds = new Set<string>()
  sorted.forEach((memory, index) => {
    if (index % stride === 0) keepIds.add(memory.id)
  })
  if (selectedId) keepIds.add(selectedId)

  return memories.filter((memory) => keepIds.has(memory.id))
}
