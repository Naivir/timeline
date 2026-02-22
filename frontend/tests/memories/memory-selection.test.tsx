import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MemoryMarker } from '../../src/components/memories/memory-marker'
import type { MemoryItem } from '../../src/services/memories/memory-types'

const memory: MemoryItem = {
  id: 'memory-1',
  sessionId: 'timeline-main',
  anchor: { type: 'point', timestamp: '2026-02-22T00:00:00Z' },
  title: 'Selectable memory',
  description: null,
  tags: ['note'],
  verticalRatio: 0.3,
  createdAt: '2026-02-22T00:00:00Z',
  updatedAt: '2026-02-22T00:00:00Z',
}

describe('memory selection behavior', () => {
  it('selects on click without starting drag when not selected', async () => {
    const onSelect = vi.fn()
    const onDragStart = vi.fn()

    render(
      <MemoryMarker
        memory={memory}
        x={320}
        yRatio={0.3}
        surfaceHeight={260}
        selected={false}
        onSelect={onSelect}
        onDragStart={onDragStart}
      />,
    )

    await userEvent.click(screen.getByLabelText('Memory: Selectable memory'))

    expect(onSelect).toHaveBeenCalledWith('memory-1')
    expect(onDragStart).not.toHaveBeenCalled()
  })
})
