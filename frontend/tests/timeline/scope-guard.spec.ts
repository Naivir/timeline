import { expect, test } from '@playwright/test'

test('does not render memory or attachment UI', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('timeline-surface')).toBeVisible()
  await expect(page.getByText(/memory|memories/i)).toHaveCount(0)
  await expect(page.getByText(/attachment|attachments/i)).toHaveCount(0)
  await expect(page.getByText(/event|events/i)).toHaveCount(0)
})
