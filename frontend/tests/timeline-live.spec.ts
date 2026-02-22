import { expect, test } from '@playwright/test'

test.describe('timeline live backend', () => {
  test('renders timeline and reaches backend health endpoint', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByLabel('Timeline axis')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Timeline Navigator' })).toBeVisible()
    await expect(page.getByTestId('new-memory-button')).toBeVisible()

    const health = await page.request.get('http://127.0.0.1:8000/api/v1/health')
    expect(health.ok()).toBeTruthy()
  })
})
