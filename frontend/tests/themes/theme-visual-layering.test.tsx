import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TimelineSurface } from '../../src/components/timeline/timeline-surface'

describe('timeline visual layering structure', () => {
  it('renders theme layer before memory and tick layers', () => {
    render(
      <TimelineSurface
        themes={[]}
        memories={[]}
        mode="none"
      />,
    )

    const themeLayer = screen.getByTestId('theme-layer')
    const memoryLayer = screen.getByTestId('memory-layer')
    const axis = screen.getByLabelText('Timeline axis')

    expect(themeLayer.compareDocumentPosition(memoryLayer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(themeLayer.compareDocumentPosition(axis) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
