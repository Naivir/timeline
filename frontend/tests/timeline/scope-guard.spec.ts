import { expect, test } from '@playwright/test'

test('renders timeline with memory entrypoint and no attachment/event UI', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('timeline-surface')).toBeVisible()
  await expect(page.getByTestId('new-memory-button')).toBeVisible()
  await expect(page.getByText(/attachment|attachments/i)).toHaveCount(0)
  await expect(page.getByText(/event|events/i)).toHaveCount(0)
})
