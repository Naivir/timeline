import { describe, expect, it } from 'vitest'

import { applyDeterministicDensity } from '../../src/services/memories/memory-density'
import type { MemoryItem } from '../../src/services/memories/memory-types'

function makeMemory(id: number): MemoryItem {
  return {
    id: `m-${id}`,
    sessionId: 'timeline-main',
    anchor: { type: 'point', timestamp: new Date(Date.UTC(2026, 0, 1, 0, id)).toISOString() },
    title: `Memory ${id}`,
    description: null,
    tags: ['note'],
    verticalRatio: 0.4,
    createdAt: new Date(Date.UTC(2026, 0, 1, 0, id)).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 0, 1, 0, id)).toISOString(),
  }
}

describe('memory density simplification', () => {
  it('returns deterministic subset for dense timelines while keeping selected item', () => {
    const memories = Array.from({ length: 90 }, (_, index) => makeMemory(index))
    const selected = 'm-45'

    const passA = applyDeterministicDensity(memories, selected, 90)
    const passB = applyDeterministicDensity(memories, selected, 90)

    expect(passA.map((item) => item.id)).toEqual(passB.map((item) => item.id))
    expect(passA.some((item) => item.id === selected)).toBe(true)
    expect(passA.length).toBeLessThan(memories.length)
  })
})
