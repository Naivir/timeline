import { expect, test } from '@playwright/test'

test('sidebar toggles and exposes actions', async ({ page }) => {
  await page.route('**/api/v1/sessions/**/memories**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', memories: [] }) })
  })
  await page.route('**/api/v1/sessions/**/themes**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionId: 'timeline-main', themes: [] }) })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Actions' }).click()
  const sidebar = page.getByTestId('action-sidebar')
  await expect(sidebar.getByRole('button', { name: 'New Memory' })).toBeVisible()
  await expect(sidebar.getByRole('button', { name: 'New Theme' })).toBeVisible()
  await expect(sidebar.getByRole('button', { name: 'New Songs' })).toBeDisabled()
  await expect(sidebar.getByRole('button', { name: 'Resize' })).toBeVisible()

  await sidebar.getByRole('button', { name: 'New Theme' }).click()
  await expect(page.getByText('Click and drag above timeline')).toBeVisible()

  await page.getByRole('button', { name: 'Actions' }).click()
  const resizeButton = page.getByTestId('action-sidebar').getByRole('button', { name: 'Resize' })
  await resizeButton.click()
  await expect(resizeButton).toHaveClass(/action-sidebar-button-active/)
})
