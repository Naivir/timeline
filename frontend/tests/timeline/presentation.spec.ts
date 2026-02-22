import { expect, test } from '@playwright/test'

test('renders centered layout with styled header and thick black axis', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Timeline Navigator' })).toBeVisible()
  await expect(page.getByText(/Drag horizontally/i)).toBeVisible()

  await expect(page.getByTestId('visible-start')).toHaveCount(0)
  await expect(page.getByTestId('active-resolution')).toHaveCount(0)
  await expect(page.getByTestId('visible-end')).toHaveCount(0)

  const surface = page.getByTestId('timeline-surface')
  const axis = page.getByLabel('Timeline axis')
  const guides = page.getByTestId('timeline-guide')

  const surfaceBox = await surface.boundingBox()
  const axisBox = await axis.boundingBox()
  expect(surfaceBox).not.toBeNull()
  expect(axisBox).not.toBeNull()

  if (!surfaceBox || !axisBox) return

  expect(axisBox.height).toBeGreaterThanOrEqual(10)
  const axisCenter = axisBox.y + axisBox.height / 2
  const viewportCenter = (await page.viewportSize())!.height / 2
  expect(Math.abs(axisCenter - viewportCenter)).toBeLessThanOrEqual(16)

  expect(surfaceBox.width).toBeGreaterThanOrEqual((await page.viewportSize())!.width * 0.98)

  const axisBackground = await axis.evaluate((el) => window.getComputedStyle(el).backgroundColor)
  expect(axisBackground).toBe('rgb(0, 0, 0)')
  await expect(guides.first()).toBeVisible()

  const surfaceBorder = await surface.evaluate((el) => window.getComputedStyle(el).borderTopWidth)
  expect(surfaceBorder).toBe('0px')
  const bodyBackground = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor)
  expect(bodyBackground).toBe('rgb(255, 255, 255)')
})
