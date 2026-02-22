import { expect, test } from '@playwright/test'

test('opens details on icon click and saves edits', async ({ page }) => {
  const requestCounts = { patch: 0 }

  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: [
            {
              id: 'memory-edit-1',
              sessionId: 'timeline-main',
              anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
              title: 'Existing memory',
              description: 'Original description',
              tags: ['note', 'travel'],
              verticalRatio: 0.35,
              createdAt: '2026-02-20T10:15:00Z',
              updatedAt: '2026-02-20T10:15:00Z',
            },
          ],
        }),
      })
      return
    }

    if (request.method() === 'PATCH') {
      requestCounts.patch += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'memory-edit-1',
          sessionId: 'timeline-main',
          anchor: { type: 'point', timestamp: '2026-02-20T11:15:00Z' },
          title: 'Updated memory',
          description: 'Updated description',
          tags: ['note', 'travel', 'favorite'],
          verticalRatio: 0.35,
          createdAt: '2026-02-20T10:15:00Z',
          updatedAt: '2026-02-20T10:16:00Z',
        }),
      })
      return
    }

    await route.continue()
  })

  await page.goto('/')
  await page.getByLabel('Memory: Existing memory').click()

  const panel = page.getByTestId('memory-details-panel')
  await expect(panel).toBeVisible()
  await expect(panel.getByText('Existing memory')).toBeVisible()
  await expect(panel.getByText('note, travel')).toBeVisible()
  await expect(panel.getByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i)).toBeVisible()
  await expect(panel.getByText(/T10:15:00Z/)).toHaveCount(0)
  await expect.poll(() => requestCounts.patch).toBe(0)

  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Updated memory')
  await page.getByRole('textbox', { name: 'Description', exact: true }).fill('Updated description')
  await page.getByRole('textbox', { name: 'Tags', exact: true }).fill('note, travel, favorite')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText('Updated memory')).toBeVisible()
  await expect(page.getByText('Updated description')).toBeVisible()
  await expect(page.getByText('note, travel, favorite')).toBeVisible()
  await expect.poll(() => requestCounts.patch).toBe(1)
})
