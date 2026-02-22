import { expect, test } from '@playwright/test'

test('exiting resize mode does not auto-open selected memory/theme details', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: [
            {
              id: 'memory-resize-exit-1',
              sessionId: 'timeline-main',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: 'Resize exit memory',
              description: null,
              tags: ['note'],
              verticalRatio: 0.36,
              createdAt: '2026-02-20T10:15:00Z',
              updatedAt: '2026-02-20T10:15:00Z',
            },
          ],
        }),
      })
      return
    }
    await route.fulfill({ status: 204, body: '' })
  })

  await page.route('**/api/v1/sessions/**/themes**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          themes: [
            {
              id: 'theme-resize-exit-1',
              sessionId: 'timeline-main',
              startTime: '2026-01-01T00:00:00Z',
              endTime: '2026-06-01T00:00:00Z',
              title: 'Resize exit theme',
              description: null,
              tags: ['theme'],
              color: '#3b82f6',
              opacity: 0.35,
              priority: 300,
              heightPx: 96,
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
            },
          ],
        }),
      })
      return
    }
    await route.fulfill({ status: 204, body: '' })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByTestId('action-sidebar').getByRole('button', { name: 'Resize' }).click()

  await page.getByLabel('Memory: Resize exit memory').click()
  await page.getByLabel('Theme: Resize exit theme').click()
  await expect(page.getByTestId('memory-details-panel')).toHaveCount(0)
  await expect(page.getByTestId('theme-details-panel')).toHaveCount(0)

  await page.getByRole('button', { name: 'Actions' }).click()
  await page.getByTestId('action-sidebar').getByRole('button', { name: 'Resize' }).click()

  await expect(page.getByTestId('memory-details-panel')).toHaveCount(0)
  await expect(page.getByTestId('theme-details-panel')).toHaveCount(0)
})
