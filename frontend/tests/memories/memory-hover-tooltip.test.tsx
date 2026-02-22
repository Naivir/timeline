import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MemoryLayer } from '../../src/components/memories/memory-layer'

describe('memory hover tooltip', () => {
  it('shows delayed preview with title and snippet', () => {
    vi.useFakeTimers()

    render(
      <MemoryLayer
        memories={[
          {
            id: 'memory-hover-1',
            sessionId: 'timeline-main',
            anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
            title: 'Trip notes',
            description: 'Pack bags before sunrise and leave',
            tags: ['travel'],
            verticalRatio: 0.4,
            createdAt: '2026-02-20T10:15:00Z',
            updatedAt: '2026-02-20T10:15:00Z',
          },
        ]}
        selectedId={null}
        startMs={Date.UTC(2026, 0, 1)}
        endMs={Date.UTC(2026, 11, 31)}
        widthPx={1000}
        isPlacementArmed={false}
        onSelect={() => {}}
        onCreateAt={() => {}}
        onUpdateMemory={() => {}}
      />,
    )

    const marker = screen.getByLabelText('Memory: Trip notes')
    fireEvent.mouseEnter(marker)

    expect(screen.queryByTestId('memory-hover-tooltip')).toBeNull()
    act(() => {
      vi.advanceTimersByTime(121)
    })

    const tooltip = screen.getByTestId('memory-hover-tooltip')
    expect(tooltip).toHaveTextContent('Trip notes')
    expect(tooltip).toHaveTextContent('Pack bags before sunrise')

    fireEvent.mouseLeave(marker)
    expect(screen.queryByTestId('memory-hover-tooltip')).toBeNull()
    vi.useRealTimers()
  })
})
