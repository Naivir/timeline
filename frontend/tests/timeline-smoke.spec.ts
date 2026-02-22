import { expect, test } from '@playwright/test'

test.describe('timeline smoke', () => {
  test('loads timeline surface with empty memory state', async ({ page }) => {
    await page.route('**/api/v1/sessions/**/memories', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'timeline-main',
          memories: [],
        }),
      })
    })

    await page.goto('/')
    await expect(page.getByLabel('Timeline axis')).toBeVisible()
    await expect(page.getByTestId('memory-marker')).toHaveCount(0)
  })

  test('keeps timeline usable when memory list fetch fails', async ({ page }) => {
    await page.route('**/api/v1/sessions/**/memories', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Service down' }),
      })
    })

    await page.goto('/')
    await expect(page.getByLabel('Timeline axis')).toBeVisible()
    await expect(page.getByTestId('new-memory-button')).toBeVisible()
  })
})
