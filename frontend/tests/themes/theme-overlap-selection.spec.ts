import { expect, test } from '@playwright/test'

test('clicking overlap selects topmost theme', async ({ page }) => {
  const themes = [
    {
      id: 'theme-low',
      sessionId: 'timeline-main',
      startTime: '2026-01-01T00:00:00Z',
      endTime: '2026-06-01T00:00:00Z',
      title: 'Low theme',
      description: null,
      tags: ['a'],
      color: '#22c55e',
      opacity: 0.35,
      priority: 100,
      heightPx: 96,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'theme-high',
      sessionId: 'timeline-main',
      startTime: '2026-02-01T00:00:00Z',
      endTime: '2026-07-01T00:00:00Z',
      title: 'High theme',
      description: null,
      tags: ['b'],
      color: '#3b82f6',
      opacity: 0.35,
      priority: 900,
      heightPx: 96,
      createdAt: '2026-01-02T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
    },
  ]

  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes }) })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(themes[1]) })
  })

  await page.goto('/')
  const blocks = page.getByTestId('theme-block')
  await expect(blocks).toHaveCount(2)
  const lowBox = await blocks.nth(0).boundingBox()
  const highBox = await blocks.nth(1).boundingBox()
  expect(lowBox).not.toBeNull()
  expect(highBox).not.toBeNull()
  const x = Math.max(lowBox?.x ?? 0, highBox?.x ?? 0) + 8
  const y = Math.max(lowBox?.y ?? 0, highBox?.y ?? 0) + 8
  await page.mouse.click(x, y)
  const panel = page.getByTestId('theme-details-panel')
  await expect(panel).toBeVisible()
  await expect(panel.getByText('High theme')).toBeVisible()
})
