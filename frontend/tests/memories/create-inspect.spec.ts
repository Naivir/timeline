import { expect, test } from '@playwright/test'

test('creates memory from header and opens details on selection', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }),
      })
      return
    }

    if (request.method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'memory-e2e-1',
          sessionId: 'timeline-main',
          anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
          title: 'Untitled Memory',
          description: null,
          tags: ['note'],
          verticalRatio: 0.46,
          createdAt: '2026-02-20T10:15:00Z',
          updatedAt: '2026-02-20T10:15:00Z',
        }),
      })
      return
    }

    if (request.method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'memory-e2e-1',
          sessionId: 'timeline-main',
          anchor: { type: 'point', timestamp: '2026-02-20T10:15:00Z' },
          title: 'A placed memory',
          description: 'Placed by clicking timeline',
          tags: ['note'],
          verticalRatio: 0.46,
          createdAt: '2026-02-20T10:15:00Z',
          updatedAt: '2026-02-20T10:15:00Z',
        }),
      })
      return
    }

    await route.continue()
  })

  await page.goto('/')

  await page.getByTestId('new-memory-button').click()
  await expect(page.getByText('Click timeline to place memory')).toBeVisible()

  await page.getByTestId('timeline-surface').click({ position: { x: 300, y: 120 } })
  await expect(page.getByTestId('memory-marker').first()).toBeVisible()
  await expect(page.getByTestId('memory-details-panel')).toBeVisible()

  const editButton = page.getByRole('button', { name: 'Edit' })
  if (await editButton.isVisible()) {
    await editButton.click()
  }
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('A placed memory')
  await page.getByRole('textbox', { name: 'Description', exact: true }).fill('Placed by clicking timeline')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText('A placed memory')).toBeVisible()
})
