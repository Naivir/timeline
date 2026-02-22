import { expect, test } from '@playwright/test'

test('shift does not enter resize mode while editing memory/theme forms', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: [
            {
              id: 'memory-edit-shift-1',
              sessionId: 'timeline-main',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: 'Shift edit memory',
              description: 'desc',
              tags: ['note'],
              verticalRatio: 0.35,
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
              id: 'theme-edit-shift-1',
              sessionId: 'timeline-main',
              startTime: '2026-01-01T00:00:00Z',
              endTime: '2026-06-01T00:00:00Z',
              title: 'Shift edit theme',
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

  await page.getByLabel('Memory: Shift edit memory').click()
  await page.getByTestId('memory-details-panel').getByRole('button', { name: 'Edit' }).click()
  const memoryTitle = page.getByRole('textbox', { name: 'Title', exact: true })
  await memoryTitle.click()
  await page.keyboard.down('Shift')
  await page.keyboard.up('Shift')
  await expect(page.getByText('Resize mode active. Drag memories or theme edges.')).toHaveCount(0)
  await expect(page.getByTestId('memory-details-panel')).toBeVisible()

  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByLabel('Theme: Shift edit theme').click()
  await page.getByTestId('theme-details-panel').getByRole('button', { name: 'Edit' }).click()
  const themeTitle = page.getByRole('textbox', { name: 'Title', exact: true })
  await themeTitle.click()
  await page.keyboard.down('Shift')
  await page.keyboard.up('Shift')
  await expect(page.getByText('Resize mode active. Drag memories or theme edges.')).toHaveCount(0)
  await expect(page.getByTestId('theme-details-panel')).toBeVisible()
})
