import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import TimelinePage from '../../src/pages/timeline-page'

describe('action sidebar behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('toggles sidebar and exposes theme/memory/resize actions', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes('/themes')) {
        return { ok: true, status: 200, json: async () => ({ sessionId: 'timeline-main', themes: [] }) } as Response
      }
      return { ok: true, status: 200, json: async () => ({ sessionId: 'timeline-main', memories: [] }) } as Response
    })
    const user = userEvent.setup()
    render(<TimelinePage />)

    const toggle = await screen.findByRole('button', { name: 'Actions' })
    await user.click(toggle)

    const sidebar = await screen.findByTestId('action-sidebar')
    expect(within(sidebar).getByRole('button', { name: 'New Memory' })).toBeVisible()
    expect(within(sidebar).getByRole('button', { name: 'New Theme' })).toBeVisible()
    expect(within(sidebar).getByRole('button', { name: 'New Songs' })).toBeDisabled()
    const resizeButton = within(sidebar).getByRole('button', { name: 'Resize' })
    expect(resizeButton).toBeVisible()

    await user.click(resizeButton)
    expect(await screen.findByText('Resize mode active. Drag memories or theme edges.')).toBeVisible()
  })
})
