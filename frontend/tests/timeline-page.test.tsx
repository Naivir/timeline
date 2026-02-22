import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TimelinePage from '../src/pages/timeline-page'

function mockFetchOnce(payload: unknown, status = 200) {
  vi.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload
  } as Response)
}

describe('TimelinePage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders loading then ready state', async () => {
    mockFetchOnce({
      timeline: {
        id: 'timeline-main',
        title: 'My Timeline',
        startLabel: 'Past',
        endLabel: 'Future',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      baseline: {
        orientation: 'horizontal',
        positionPercent: 50,
        thicknessPx: 4,
        lengthPercent: 92
      },
      eventPlaceholders: [],
      meta: { requestId: 'test-id' }
    })

    render(<TimelinePage />)

    expect(screen.getByText(/Loading timeline/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText(/Base timeline line/i)).toBeInTheDocument())
  })

  it('renders error and supports retry', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ code: 'SERVICE_UNAVAILABLE', message: 'Service down' })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          timeline: {
            id: 'timeline-main',
            title: 'My Timeline',
            startLabel: 'Past',
            endLabel: 'Future',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          baseline: {
            orientation: 'horizontal',
            positionPercent: 50,
            thicknessPx: 4,
            lengthPercent: 92
          },
          eventPlaceholders: [],
          meta: { requestId: 'retry-id' }
        })
      } as Response)

    render(<TimelinePage />)

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /Retry Timeline Load/i }))
    await waitFor(() => expect(screen.getByLabelText(/Base timeline line/i)).toBeInTheDocument())
  })
})
