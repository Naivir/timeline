import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TimelinePage from '../src/pages/timeline-page'

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

describe('TimelinePage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders timeline surface and loads memory markers', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.includes('/themes')) {
        return jsonResponse({ sessionId: 'default-session', themes: [] })
      }
      if (method === 'GET') {
        return jsonResponse({
          sessionId: 'default-session',
          memories: [
            {
              id: 'memory-1',
              sessionId: 'default-session',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: 'First memory',
              description: null,
              tags: ['note'],
              verticalRatio: 0.3,
              createdAt: '2026-02-20T10:15:00Z',
              updatedAt: '2026-02-20T10:15:00Z',
            },
          ],
        })
      }
      return jsonResponse({}, 204)
    })

    render(<TimelinePage />)

    expect(screen.getByRole('heading', { name: /Timeline Navigator/i })).toBeInTheDocument()
    expect(screen.getByTestId('new-memory-button')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText(/Timeline axis/i)).toBeInTheDocument())
    await waitFor(() => expect(screen.getByLabelText(/Memory: First memory/i)).toBeInTheDocument())
  })

  it('keeps timeline usable when memory list request fails', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes('/themes')) {
        return jsonResponse({ sessionId: 'default-session', themes: [] })
      }
      return jsonResponse({ message: 'unavailable' }, 500)
    })

    render(<TimelinePage />)

    await waitFor(() => expect(screen.getByLabelText(/Timeline axis/i)).toBeInTheDocument())
    expect(screen.queryAllByTestId('memory-marker')).toHaveLength(0)
    expect(screen.getByTestId('new-memory-button')).toBeInTheDocument()
  })

  it('arms placement from header and creates memory on timeline click', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.includes('/themes')) {
        return jsonResponse({ sessionId: 'default-session', themes: [] })
      }
      if (method === 'GET') {
        return jsonResponse({ sessionId: 'default-session', memories: [] })
      }
      if (method === 'POST') {
        return jsonResponse({
          id: 'memory-2',
          sessionId: 'default-session',
          anchor: { type: 'point', timestamp: '2026-02-21T10:15:00Z' },
          title: 'New Memory',
          description: null,
          tags: ['note'],
          verticalRatio: 0.45,
          createdAt: '2026-02-21T10:15:00Z',
          updatedAt: '2026-02-21T10:15:00Z',
        }, 201)
      }
      return jsonResponse({}, 204)
    })

    render(<TimelinePage />)
    await waitFor(() => expect(screen.getByLabelText(/Timeline axis/i)).toBeInTheDocument())
    await userEvent.click(screen.getByTestId('new-memory-button'))

    expect(screen.getByText(/Click timeline to place memory/i)).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('memory-layer'))

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByLabelText(/Memory: New Memory/i)).toBeInTheDocument())
    expect(screen.getByRole('heading', { name: /Edit Memory/i })).toBeInTheDocument()
  })

  it('opens edit mode and updates title/description', async () => {
    let updated = false
    vi.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.includes('/themes')) {
        return jsonResponse({ sessionId: 'default-session', themes: [] })
      }
      if (method === 'GET') {
        return jsonResponse({
          sessionId: 'default-session',
          memories: [
            {
              id: 'memory-5',
              sessionId: 'default-session',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: updated ? 'Updated title' : 'Original',
              description: updated ? 'Updated desc' : 'Original desc',
              tags: ['note'],
              verticalRatio: 0.35,
              createdAt: '2026-02-20T10:15:00Z',
              updatedAt: '2026-02-20T10:15:00Z',
            },
          ],
        })
      }
      if (method === 'PATCH') {
        updated = true
        return jsonResponse({
          id: 'memory-5',
          sessionId: 'default-session',
          anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
          title: 'Updated title',
          description: 'Updated desc',
          tags: ['note'],
          verticalRatio: 0.35,
          createdAt: '2026-02-20T10:15:00Z',
          updatedAt: '2026-02-20T10:16:00Z',
        })
      }
      return jsonResponse({}, 204)
    })

    render(<TimelinePage />)
    await waitFor(() => expect(screen.getByLabelText(/Memory: Original/i)).toBeInTheDocument())
    await userEvent.click(screen.getByLabelText(/Memory: Original/i))
    await userEvent.click(screen.getByRole('button', { name: /Edit/i }))
    const panel = screen.getByTestId('memory-details-panel')
    await userEvent.clear(within(panel).getByRole('textbox', { name: 'Title', exact: true }))
    await userEvent.type(within(panel).getByRole('textbox', { name: 'Title', exact: true }), 'Updated title')
    await userEvent.clear(within(panel).getByRole('textbox', { name: 'Description', exact: true }))
    await userEvent.type(within(panel).getByRole('textbox', { name: 'Description', exact: true }), 'Updated desc')
    await userEvent.click(screen.getByRole('button', { name: /Save/i }))

    await waitFor(() => expect(screen.getByText('Updated title')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText('Updated desc')).toBeInTheDocument())
  })
})
