import { expect, test } from '@playwright/test'

test.describe('timeline live backend', () => {
  test('fetches timeline from live backend in browser', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByLabel('Base timeline line')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'My Timeline' })).toBeVisible()

    const health = await page.request.get('http://127.0.0.1:8000/api/v1/health')
    expect(health.ok()).toBeTruthy()
  })
})
