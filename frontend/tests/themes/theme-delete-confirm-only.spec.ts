import { expect, test } from '@playwright/test'

test('theme delete uses in-app confirmation without undo toast', async ({ page }) => {
  let themes = [
    {
      id: 'theme-1',
      sessionId: 'timeline-main',
      startTime: '2026-01-01T00:00:00Z',
      endTime: '2026-06-01T00:00:00Z',
      title: 'Disposable',
      description: 'test',
      tags: ['x'],
      color: '#3b82f6',
      opacity: 0.4,
      priority: 200,
      heightPx: 96,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
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
    if (request.method() === 'DELETE') {
      themes = []
      await route.fulfill({ status: 204, body: '' })
      return
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(themes[0]) })
  })

  await page.goto('/')
  await page.getByTestId('theme-block').first().click()
  await page.getByRole('button', { name: 'Delete' }).click()
  const confirmModal = page.getByTestId('theme-confirm-modal')
  await expect(confirmModal).toBeVisible()
  await expect(page.locator('[data-testid="theme-details-panel"] [data-testid="theme-confirm-modal"]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Delete theme' }).click()
  await expect(page.getByTestId('theme-block')).toHaveCount(0)
  await expect(page.getByTestId('memory-undo-toast')).toHaveCount(0)
})
