import { expect, test } from '@playwright/test'

test('timeline vertical area is expanded and controls remain visible', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [] }) })
  })

  await page.goto('/')
  const surface = page.getByTestId('timeline-surface')
  const box = await surface.boundingBox()
  expect((box?.height ?? 0)).toBeGreaterThanOrEqual(500)

  await expect(page.getByRole('button', { name: 'Actions' })).toBeVisible()
})
